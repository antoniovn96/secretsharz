import React from 'react';
import CareerAssessmentV2 from '../../../src/CareerAssessmentV2';
import AssessmentAccessibilityShell from '../../../src/career/AssessmentAccessibilityShell';

export default function CareerDiscoveryAssessmentPage(){
  return (
    <div style={{minHeight:'100vh',background:'#f8fafc',padding:'24px'}}>
      <AssessmentAccessibilityShell>
        <CareerAssessmentV2 onUnlock={()=>{window.location.href='/dashboard/career/payment-v2';}} />
      </AssessmentAccessibilityShell>
    </div>
  );
}
