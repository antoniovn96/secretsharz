import React from 'react';
import CareerAssessmentV2 from '../../../src/CareerAssessmentV2';
export default function CareerDiscoveryAssessmentPage(){return <div style={{minHeight:'100vh',background:'#f8fafc',padding:'24px'}}><CareerAssessmentV2 onUnlock={()=>{window.location.href='/dashboard/career/payment-v2';}} /></div>;}
