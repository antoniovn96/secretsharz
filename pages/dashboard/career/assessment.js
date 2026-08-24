import React from 'react';
import CareerAssessmentV3 from '../../../src/CareerAssessmentV3';
import AssessmentAccessibilityShell from '../../../src/career/AssessmentAccessibilityShell';

export default function CareerAssessmentPage(){
 return (
  <div style={{minHeight:'100vh',background:'#f8fafc',padding:'24px'}}>
   <AssessmentAccessibilityShell>
    <CareerAssessmentV3 onUnlock={()=>{window.location.href='/dashboard/career/payment-v2';}} />
   </AssessmentAccessibilityShell>
  </div>
 );
}
