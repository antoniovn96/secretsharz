import React,{createContext,useCallback,useContext,useEffect,useMemo,useRef,useState} from 'react';
import {auth} from '../firebase';

const InstitutionCareerDataContext=createContext(null);

export function InstitutionCareerDataProvider({children}){
  const [data,setData]=useState({institution:null,students:[],summary:{},analytics:null});
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState('');
  const requestRef=useRef(0);

  const refresh=useCallback(async(institutionId='')=>{
    const requestId=++requestRef.current;
    setError('');
    try{
      const token=await auth.currentUser?.getIdToken();
      if(!token)throw new Error('Authentication required.');
      const key=String(institutionId||'');
      const url=key?`/api/institution/dashboard?institutionId=${encodeURIComponent(key)}`:'/api/institution/dashboard';
      const response=await fetch(url,{headers:{Authorization:`Bearer ${token}`}});
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

  useEffect(()=>{refresh().catch(()=>{});},[refresh]);

  const value=useMemo(()=>({...data,loading,error,refresh}),[data,loading,error,refresh]);
  return <InstitutionCareerDataContext.Provider value={value}>{children}</InstitutionCareerDataContext.Provider>;
}

export function useInstitutionCareerData(){
  const value=useContext(InstitutionCareerDataContext);
  if(!value)throw new Error('useInstitutionCareerData must be used inside InstitutionCareerDataProvider.');
  return value;
}
