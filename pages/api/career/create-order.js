import { getAdminAuth, getAdminFirestore } from '../../../src/security/firebaseAdmin.js';
import {
  calculateCouponDiscount,
  customerTypeForProduct,
  getCareerProductConfig,
  normaliseCouponCode,
  validateCoupon,
  serialiseCoupon,
} from '../../../src/server/careerPricing.js';

function jsonError(res, status, message) { return res.status(status).json({ error: message }); }
function bearerToken(req) { const h=req.headers.authorization||req.headers.Authorization; if(typeof h!=='string')return null; const m=h.match(/^Bearer\s+(.+)$/i); return m?m[1]:null; }

export default async function handler(req,res){
  if(req.method!=='POST'){res.setHeader('Allow','POST');return jsonError(res,405,'Method not allowed.');}
  const idToken=bearerToken(req); if(!idToken)return jsonError(res,401,'Authentication required.');
  let decoded; try{decoded=await getAdminAuth().verifyIdToken(idToken);}catch(_){return jsonError(res,401,'Invalid or expired authentication token.');}

  const db=getAdminFirestore();
  const requestedProduct=String(req.body?.product||'student_individual').trim();
  const product=await getCareerProductConfig(db,requestedProduct);
  if(!product)return jsonError(res,400,'Unsupported career product.');
  if(product.active===false)return jsonError(res,409,'This career product is currently unavailable.');
  if(product.amountPaise===0)return jsonError(res,400,'This product does not require a payment order.');

  const customerType=customerTypeForProduct(requestedProduct); const quantity=Number.isInteger(product.seats)&&product.seats>0?product.seats:1; const baseAmount=Math.max(0,Number(product.amountPaise||0)); const couponCode=normaliseCouponCode(req.body?.couponCode); let coupon=null; let discountAmount=0;
  if(couponCode){const couponSnap=await db.collection('careerCoupons').doc(couponCode).get();if(!couponSnap.exists)return jsonError(res,400,'Coupon code was not found.');coupon=couponSnap.data();const validation=validateCoupon(coupon,{productKey:requestedProduct,customerType,quantity});if(!validation.valid)return jsonError(res,400,validation.reason);discountAmount=calculateCouponDiscount(coupon,baseAmount,quantity);}
  const finalAmount=Math.max(0,baseAmount-discountAmount); const now=new Date().toISOString(); const paymentOrderRef=db.collection('paymentOrders').doc();
  const commonRecord={id:paymentOrderRef.id,userId:decoded.uid,customerType,productKey:requestedProduct,productSku:product.sku,productLabel:product.label,reportTier:product.reportTier,quantity,baseAmountPaise:baseAmount,discountAmountPaise:discountAmount,amountPaise:finalAmount,currency:'INR',coupon:serialiseCoupon(coupon,couponCode),couponCode:couponCode||null,status:finalAmount===0?'sponsored':'created',createdAt:now,updatedAt:now};

  if(finalAmount===0){
    await db.runTransaction(async transaction=>{
      const freshCoupon=couponCode?await transaction.get(db.collection('careerCoupons').doc(couponCode)):null;
      if(couponCode){if(!freshCoupon?.exists)throw Object.assign(new Error('Coupon is no longer available.'),{status:409});const fresh=freshCoupon.data();const validation=validateCoupon(fresh,{productKey:requestedProduct,customerType,quantity});if(!validation.valid)throw Object.assign(new Error(validation.reason),{status:409});transaction.update(freshCoupon.ref,{redemptions:Number(fresh.redemptions||0)+1,updatedAt:now});}
      transaction.set(paymentOrderRef,{...commonRecord,paymentId:null,razorpayOrderId:null,sponsoredAt:now,updatedAt:now});
      transaction.set(db.collection('users').doc(decoded.uid),{careerReportAccess:{status:'paid',product:product.sku,productKey:requestedProduct,orderId:paymentOrderRef.id,paymentId:null,amount:0,currency:'INR',couponCode,sponsored:true,paidAt:now}},{merge:true});
    });
    return res.status(200).json({sponsored:true,verified:true,access:'paid',product:product.sku,orderId:paymentOrderRef.id,amount:0});
  }

  const keyId=process.env.RAZORPAY_KEY_ID,keySecret=process.env.RAZORPAY_KEY_SECRET; if(!keyId||!keySecret)return jsonError(res,503,'Payment gateway is not configured yet.');
  try{
    const receipt=`career_${product.sku.toLowerCase()}_${decoded.uid.slice(0,12)}_${Date.now()}`;
    const payload={amount:finalAmount,currency:'INR',receipt,notes:{uid:decoded.uid,product:product.sku,productKey:requestedProduct,reportTier:product.reportTier,coupon:couponCode||''}};
    const authHeader=Buffer.from(`${keyId}:${keySecret}`).toString('base64'); const response=await fetch('https://api.razorpay.com/v1/orders',{method:'POST',headers:{Authorization:`Basic ${authHeader}`,'Content-Type':'application/json'},body:JSON.stringify(payload)}); const data=await response.json();
    if(!response.ok||!data?.id){console.error('[career/create-order] Razorpay error:',data);return jsonError(res,502,'Unable to create the payment order.');}
    await paymentOrderRef.set({...commonRecord,razorpayOrderId:data.id,razorpayReceipt:receipt,updatedAt:new Date().toISOString()});
    return res.status(200).json({orderId:data.id,amount:data.amount,currency:data.currency,keyId,product:product.sku,productKey:requestedProduct,label:product.label,reportTier:product.reportTier,baseAmount,discountAmount,coupon:serialiseCoupon(coupon,couponCode)});
  }catch(err){console.error('[career/create-order] request failed:',err?.message||err);return jsonError(res,502,'Payment gateway request failed.');}
}
