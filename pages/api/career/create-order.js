import { getAdminAuth, getAdminFirestore } from '../../../src/security/firebaseAdmin.js';
import { getCareerProduct, getConfiguredPrice } from '../../../src/config/careerPricing.js';

const DEFAULT_PRICE_PAISE = 99900;
function jsonError(res,status,message){return res.status(status).json({error:message});}
function bearerToken(req){const h=req.headers.authorization||req.headers.Authorization;if(typeof h!=='string')return null;const m=h.match(/^Bearer\s+(.+)$/i);return m?m[1]:null;}

export default async function handler(req,res){
  if(req.method!=='POST'){res.setHeader('Allow','POST');return jsonError(res,405,'Method not allowed.');}
  const idToken=bearerToken(req);if(!idToken)return jsonError(res,401,'Authentication required.');
  const keyId=process.env.RAZORPAY_KEY_ID,keySecret=process.env.RAZORPAY_KEY_SECRET;
  if(!keyId||!keySecret)return jsonError(res,503,'Payment gateway is not configured yet.');
  let decoded;try{decoded=await getAdminAuth().verifyIdToken(idToken);}catch(_){return jsonError(res,401,'Invalid or expired authentication token.');}
  const requestedProduct=String(req.body?.product||'student_individual').trim();const product=getCareerProduct(requestedProduct);
  if(!product)return jsonError(res,400,'Unsupported career product.');
  if(product.amountPaise===0)return jsonError(res,400,'This product does not require a payment order.');
  let configuredAmount=getConfiguredPrice(requestedProduct,product.amountPaise||DEFAULT_PRICE_PAISE);
  try{const snap=await getAdminFirestore().collection('platformConfig').doc('careerPricing').get();const override=snap.exists?snap.data()?.products?.[requestedProduct]:null;if(override?.active===false)return jsonError(res,409,'This career product is currently unavailable.');if(Number.isInteger(override?.amountPaise)&&override.amountPaise>=100)configuredAmount=override.amountPaise;}catch(e){console.error('[career/create-order] pricing config read failed:',e?.message||e);}
  if(!Number.isInteger(configuredAmount)||configuredAmount<100)return jsonError(res,500,'Invalid career product price configuration.');
  const receipt=`career_${product.sku.toLowerCase()}_${decoded.uid.slice(0,12)}_${Date.now()}`;
  const payload={amount:configuredAmount,currency:'INR',receipt,notes:{uid:decoded.uid,product:product.sku,reportTier:product.reportTier}};
  try{const authHeader=Buffer.from(`${keyId}:${keySecret}`).toString('base64');const response=await fetch('https://api.razorpay.com/v1/orders',{method:'POST',headers:{Authorization:`Basic ${authHeader}`,'Content-Type':'application/json'},body:JSON.stringify(payload)});const data=await response.json();if(!response.ok||!data?.id){console.error('[career/create-order] Razorpay error:',data);return jsonError(res,502,'Unable to create the payment order.');}return res.status(200).json({orderId:data.id,amount:data.amount,currency:data.currency,keyId,product:product.sku,label:product.label,reportTier:product.reportTier});}catch(err){console.error('[career/create-order] request failed:',err?.message||err);return jsonError(res,502,'Payment gateway request failed.');}
}
