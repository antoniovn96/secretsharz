import crypto from 'crypto';
import { getAdminAuth, getAdminFirestore } from '../../../src/security/firebaseAdmin.js';

function jsonError(res,status,message){return res.status(status).json({error:message});}
function bearerToken(req){const header=req.headers.authorization||req.headers.Authorization;if(typeof header!=='string')return null;const match=header.match(/^Bearer\s+(.+)$/i);return match?match[1]:null;}

export default async function handler(req,res){
 if(req.method!=='POST'){res.setHeader('Allow','POST');return jsonError(res,405,'Method not allowed.');}
 const idToken=bearerToken(req);if(!idToken)return jsonError(res,401,'Authentication required.');
 const keyId=process.env.RAZORPAY_KEY_ID;const keySecret=process.env.RAZORPAY_KEY_SECRET;if(!keyId||!keySecret)return jsonError(res,503,'Payment gateway is not configured yet.');
 let decodedToken;try{decodedToken=await getAdminAuth().verifyIdToken(idToken);}catch(_){return jsonError(res,401,'Invalid or expired authentication token.');}
 const {razorpay_order_id:orderId,razorpay_payment_id:paymentId,razorpay_signature:signature}=req.body||{};
 if(!orderId||!paymentId||!signature)return jsonError(res,400,'Incomplete payment verification data.');
 const expectedSignature=crypto.createHmac('sha256',keySecret).update(`${orderId}|${paymentId}`).digest('hex');
 const provided=Buffer.from(String(signature));const expected=Buffer.from(expectedSignature);if(provided.length!==expected.length||!crypto.timingSafeEqual(provided,expected))return jsonError(res,400,'Payment signature verification failed.');
 const db=getAdminFirestore();const orderSnap=await db.collection('paymentOrders').doc(String(orderId)).get();if(!orderSnap.exists)return jsonError(res,404,'Payment order was not created by VidyaVantage.');
 const orderRecord=orderSnap.data();
 if(orderRecord.userId!==decodedToken.uid)return jsonError(res,403,'Payment order is not associated with this account.');
 if(orderRecord.razorpayOrderId!==orderId)return jsonError(res,400,'Payment order reference is invalid.');
 if(orderRecord.status==='captured')return res.status(200).json({verified:true,access:'paid',paymentId:orderRecord.paymentId||paymentId,orderId,bundleId:orderRecord.bundleId||null,product:orderRecord.productSku||null});
 try{
   const authHeader=Buffer.from(`${keyId}:${keySecret}`).toString('base64');
   const orderResponse=await fetch(`https://api.razorpay.com/v1/orders/${encodeURIComponent(orderId)}`,{headers:{Authorization:`Basic ${authHeader}`}});
   const razorpayOrder=await orderResponse.json();
   if(!orderResponse.ok){console.error('[career/verify-payment] order lookup failed:',razorpayOrder);return jsonError(res,502,'Unable to verify the payment order with Razorpay.');}
   const expectedAmount=Number(orderRecord.amountPaise||0);
   if(razorpayOrder.id!==orderId||razorpayOrder.currency!=='INR'||Number(razorpayOrder.amount)!==expectedAmount)return jsonError(res,400,'Payment order does not match the recorded product price.');
   if(razorpayOrder.notes?.uid!==decodedToken.uid||razorpayOrder.notes?.product!==orderRecord.productSku)return jsonError(res,403,'Payment order is not associated with this account.');
   const paymentResponse=await fetch(`https://api.razorpay.com/v1/payments/${encodeURIComponent(paymentId)}`,{headers:{Authorization:`Basic ${authHeader}`}});
   const payment=await paymentResponse.json();
   if(!paymentResponse.ok){console.error('[career/verify-payment] payment lookup failed:',payment);return jsonError(res,502,'Unable to verify the payment with Razorpay.');}
   if(payment.order_id!==orderId||payment.currency!=='INR'||Number(payment.amount)!==expectedAmount)return jsonError(res,400,'Payment details do not match the recorded order.');
   if(String(payment.status)!=='captured')return jsonError(res,400,'Payment has not been successfully captured.');
   const now=new Date().toISOString();
   await db.runTransaction(async(transaction)=>{
     const freshOrder=await transaction.get(db.collection('paymentOrders').doc(orderId));
     if(!freshOrder.exists)throw Object.assign(new Error('Payment order record disappeared.'),{status:404});
     const freshOrderData=freshOrder.data();
     if(freshOrderData.userId!==decodedToken.uid)throw Object.assign(new Error('Payment order ownership check failed.'),{status:403});
     if(freshOrderData.status==='captured')return;
     if(freshOrderData.couponCode){const couponRef=db.collection('careerCoupons').doc(freshOrderData.couponCode);const couponSnap=await transaction.get(couponRef);if(couponSnap.exists){const coupon=couponSnap.data();const max=Number(coupon.maxRedemptions||0);const redemptions=Number(coupon.redemptions||0);if(max>0&&redemptions>=max)throw Object.assign(new Error('This coupon reached its redemption limit while the payment was being completed.'),{status:409});transaction.update(couponRef,{redemptions:redemptions+1,updatedAt:now});}}
     transaction.update(db.collection('paymentOrders').doc(orderId),{status:'captured',paymentId,capturedAt:now,updatedAt:now});
     transaction.set(db.collection('users').doc(decodedToken.uid),{careerReportAccess:{status:'paid',product:freshOrderData.productSku,productKey:freshOrderData.productKey,bundleId:freshOrderData.bundleId||null,bundleSku:freshOrderData.bundleSku||null,orderId,paymentId,amount:Number(payment.amount),currency:payment.currency,couponCode:freshOrderData.couponCode||null,sponsored:false,paidAt:now,reportTier:'full',reportPages:20}},{merge:true});
   });
   return res.status(200).json({verified:true,access:'paid',paymentId,orderId,product:orderRecord.productSku,bundleId:orderRecord.bundleId||null});
 }catch(err){console.error('[career/verify-payment] failed:',err?.message||err);return jsonError(res,err.status||500,err.message||'Payment verification failed.');}
}
