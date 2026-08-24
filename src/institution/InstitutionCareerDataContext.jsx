import React,{createContext,useCallback,useContext,useEffect,useMemo,useRef,useState} from 'react';
import {auth} from '../firebase';
import {onAuthStateChanged} from 'firebase/auth';

const InstitutionCareerDataContext=createContext(null);

export function InstitutionCareerDataProvider({children}){
  const [data,setData]=useState({institution:null,students:[],summary:{},analytics:null});
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState('');
  const [authReady,setAuthReady]=useState(false);
  const requestRef=useRef(0);

  const refresh=useCallback(async(institutionId='')=>{
    const requestId=++requestRef.current;
    setError('');
    setLoading(true);
    try{
      const user=auth.currentUser;
      if(!user)throw new Error('Authentication required.');
      const tokenResult=await user.getIdTokenResult(true);
      const token=tokenResult.token;
      const claimInstitutionId=typeof tokenResult.claims?.institutionId==='string'?tokenResult.claims.institutionId.trim():'';
      const key=String(institutionId||claimInstitutionId||'').trim();
      if(!key)throw new Error('Institution ID is required.');
      const url=`/api/institution/dashboard?institutionId=${encodeURIComponent(key)}`;
      const response=await fetch(url,{headers:{Authorization:`Bearer ${token}`},cache:'no-store'});
      const next=await response.json();
      if(!response.ok)throw new Error(next?.error||'Unable to load institution dashboard.');
      if(requestId===requestRef.current)setData({institution:next.institution||null,students:Array.isArray(next.students)?next.students:[],summary:next.summary||{},analytics:next.analytics||null});
      return next;
    }catch(error){
      if(requestId===requestRef.current)setError(error.message||'Unable to load institution dashboard.');
      throw error;
    }finally{
      if(requestId===requestRef.current)setLoading(false);
    }
  },[]);

  useEffect(()=>{
    let active=true;
    const unsubscribe=onAuthStateChanged(auth,(user)=>{
      if(!active)return;
      setAuthReady(true);
      if(user)refresh().catch(()=>{});
      else{setData({institution:null,students:[],summary:{},analytics:null});setError('Authentication required.');setLoading(false);}
    });
    return ()=>{active=false;unsubscribe();};
  },[refresh]);

  const value=useMemo(()=>({...data,loading,error,refresh,authReady}),[data,loading,error,refresh,authReady]);
  return <InstitutionCareerDataContext.Provider value={value}>{children}</InstitutionCareerDataContext.Provider>;
}

export function useInstitutionCareerData(){
  const value=useContext(InstitutionCareerDataContext);
  if(!value)throw new Error('useInstitutionCareerData must be used inside InstitutionCareerDataProvider.');
  return value;
}
