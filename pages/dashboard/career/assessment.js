import React from 'react';
import CareerAssessmentV3 from '../../../src/CareerAssessmentV3';

export default function CareerAssessmentPage(){
 return <div style={{minHeight:'100vh',background:'#f8fafc',padding:'24px'}}><CareerAssessmentV3 onUnlock={()=>{window.location.href='/dashboard/career/payment-v2';}} /></div>;
}
