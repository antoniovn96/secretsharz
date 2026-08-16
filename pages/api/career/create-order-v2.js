import { getAdminAuth, getAdminFirestore } from '../../../src/security/firebaseAdmin.js';
import { getCareerProduct, getConfiguredPrice } from '../../../src/config/careerPricing.js';
import { resolveBundle } from '../../../src/career/assessmentSelection.js';

function bearerToken(req){const h=req.headers.authorization||req.headers.Authorization;if(typeof h!=='string')return null;const m=h.match(/^Bearer\s+(.+)$/i);return m?m[1]:null;}
function clean(v,max=160){return String(v||'').trim().slice(0,max);}

export default async function handler(req,res){
 if(req.method!=='POST')return res.status(405).json({error:'Method not allowed.'});
 const token=bearerToken(req);if(!token)return res.status(401).json({error:'Authentication required.'});
 const keyId=process.env.RAZORPAY_KEY_ID;const keySecret=process.env.RAZORPAY_KEY_SECRET;
 if(!keyId||!keySecret)return res.status(503).json({error:'Payment gateway is not configured yet.'});
 let decoded;try{decoded=await getAdminAuth().verifyIdToken(token);}catch(_){return res.status(401).json({error:'Invalid or expired authentication token.'});}
 const body=req.body||{};
 const productKey=clean(body.productKey,80)||'student_individual';
 const product=getCareerProduct(productKey);
 if(!product||product.reportTier!=='full')return res.status(400).json({error:'A valid premium career product is required.'});
 const bundle=resolveBundle(clean(body.bundleId,160));
 const fallback=Number(product.amountPaise||0);
 const amount=getConfiguredPrice(productKey,fallback);
 if(!Number.isInteger(amount)||amount<100)return res.status(400).json({error:'This product does not have a valid configured price.'});
 const db=getAdminFirestore();
 const receipt=`career_v2_${decoded.uid.slice(0,12)}_${Date.now()}`;
 try{
   const authHeader=Buffer.from(`${keyId}:${keySecret}`).toString('base64');
   const r=await fetch('https://api.razorpay.com/v1/orders',{method:'POST',headers:{Authorization:`Basic ${authHeader}`,'Content-Type':'application/json'},body:JSON.stringify({amount,currency:'INR',receipt,notes:{uid:decoded.uid,product:product.sku,productKey,bundleId:bundle.id,bundleSku:bundle.sku}})});
   const data=await r.json();
   if(!r.ok||!data?.id){console.error('[career/create-order-v2]',data);return res.status(502).json({error:'Unable to create the payment order.'});}
   const now=new Date().toISOString();
   await db.collection('paymentOrders').doc(data.id).set({
     razorpayOrderId:data.id,
     userId:decoded.uid,
     productSku:product.sku,
     productKey,
     productLabel:product.label,
     bundleId:bundle.id,
     bundleSku:bundle.sku,
     amountPaise:amount,
     currency:'INR',
     status:'created',
     receipt,
     couponCode:null,
     createdAt:now,
     updatedAt:now
   });
   return res.status(200).json({orderId:data.id,amount:data.amount,currency:data.currency,keyId,product:product.sku,productKey,bundleId:bundle.id,bundleTitle:bundle.title,reportPages:20});
 }catch(e){console.error('[career/create-order-v2]',e?.message||e);return res.status(502).json({error:'Payment gateway request failed.'});}
}
