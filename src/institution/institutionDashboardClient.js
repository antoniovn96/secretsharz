let cachedKey='';
let cachedPromise=null;
let cachedAt=0;
const CACHE_MS=5000;

export async function fetchInstitutionDashboard(auth,institutionId='',{force=false}={}){
  const key=String(institutionId||'');
  if(!force&&cachedPromise&&cachedKey===key&&Date.now()-cachedAt<CACHE_MS)return cachedPromise;
  cachedKey=key;
  cachedAt=Date.now();
  cachedPromise=(async()=>{
    const token=await auth.currentUser?.getIdToken();
    if(!token)throw new Error('Authentication required.');
    const url=key?`/api/institution/dashboard?institutionId=${encodeURIComponent(key)}`:'/api/institution/dashboard';
    const response=await fetch(url,{headers:{Authorization:`Bearer ${token}`}});
    const data=await response.json();
    if(!response.ok)throw new Error(data?.error||'Unable to load institution dashboard.');
    return data;
  })();
  try{return await cachedPromise;}catch(error){cachedPromise=null;throw error;}
}

export function invalidateInstitutionDashboardCache(){
  cachedKey='';
  cachedPromise=null;
  cachedAt=0;
}
