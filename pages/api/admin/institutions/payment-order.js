import { getAdminAuth, getAdminFirestore } from '../../../../src/security/firebaseAdmin.js';
import crypto from 'crypto';

const FOUNDER_EMAIL='antonio.antonio.noronha@gmail.com';
function bearerToken(req){const h=req.headers.authorization||req.headers.Authorization;if(typeof h!=='string')return null;const m=h.match(/^Bearer\s+(.+)$/i);return m?m[1]:null;}
async function requireAdmin(req){const token=bearerToken(req);if(!token)throw Object.assign(new Error('Authentication required.'),{status:401});let decoded;try{decoded=await getAdminAuth().verifyIdToken(token);}catch(_){throw Object.assign(new Error('Invalid or expired authentication token.'),{status:401});}const db=getAdminFirestore();const snap=await db.collection('users').doc(decoded.uid).get();const user=snap.exists?snap.data():{};const founder=decoded.email_verified===true&&decoded.email?.toLowerCase()===FOUNDER_EMAIL;if(!founder&&user.role!=='super_admin')throw Object.assign(new Error('Super Admin access required.'),{status:403});return{db,decoded};}

export default async function handler(req,res){
  if(req.method!=='POST')return res.status(405).json({error:'Method not allowed.'});
  try{
    const{db,decoded}=await requireAdmin(req);const institutionId=String(req.body?.institutionId||'').trim();if(!institutionId)return res.status(400).json({error:'Institution ID is required.'});
    const institutionRef=db.collection('institutions').doc(institutionId);const snap=await institutionRef.get();if(!snap.exists)return res.status(404).json({error:'Institution not found.'});const institution=snap.data();
    if(institution.licenses?.paymentStatus==='paid')return res.status(409).json({error:'This institution entitlement is already marked paid.'});
    const totalAmountRupees=Math.max(0,Number(institution.licenses?.totalAmount||0));if(!Number.isFinite(totalAmountRupees))return res.status(400).json({error:'Institution has an invalid payable amount.'});
    const amountPaise=Math.round(totalAmountRupees*100);
    if(amountPaise===0){const now=new Date().toISOString();await institutionRef.set({status:'active',licenses:{...(institution.licenses||{}),paymentStatus:'paid',paidAt:now,paidBy:decoded.uid,paidAmount:0,paidAmountPaise:0,currency:'INR'},updatedAt:now},{merge:true});return res.status(200).json({sponsored:true,verified:true,institutionId,amount:0});}
    const keyId=process.env.RAZORPAY_KEY_ID,keySecret=process.env.RAZORPAY_KEY_SECRET;if(!keyId||!keySecret)return res.status(503).json({error:'Payment gateway is not configured yet.'});
    const receipt=`institution_${institutionId.slice(0,12)}_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
    const payload={amount:amountPaise,currency:'INR',receipt,notes:{institutionId,product:'institution_assessment_license',licenseCount:String(institution.licenses?.purchased||0),createdBy:decoded.uid}};
    const authHeader=Buffer.from(`${keyId}:${keySecret}`).toString('base64');const response=await fetch('https://api.razorpay.com/v1/orders',{method:'POST',headers:{Authorization:`Basic ${authHeader}`,'Content-Type':'application/json'},body:JSON.stringify(payload)});const data=await response.json();if(!response.ok||!data?.id){console.error('[admin/institutions/payment-order] Razorpay error:',data);return res.status(502).json({error:'Unable to create the institution payment order.'});}
    await db.collection('institutionPayments').doc(data.id).set({orderId:data.id,institutionId,institutionName:institution.name||'',amountPaise,amountRupees:totalAmountRupees,currency:'INR',licenseCount:Number(institution.licenses?.purchased||0),status:'created',receipt,createdBy:decoded.uid,createdAt:new Date().toISOString()});
    return res.status(200).json({orderId:data.id,amount:data.amount,currency:data.currency,keyId,institutionId,licenseCount:Number(institution.licenses?.purchased||0),institutionName:institution.name||'',amountRupees:totalAmountRupees});
  }catch(error){return res.status(error.status||500).json({error:error.message||'Unable to create institution payment order.'});}
}
