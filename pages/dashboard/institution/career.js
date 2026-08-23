import React from 'react';
import InstitutionCareerDashboard from '../../../src/institution/InstitutionCareerDashboard';
import InstitutionCareerInsights from '../../../src/institution/InstitutionCareerInsights';

export default function InstitutionCareerPage(){
  return <>
    <InstitutionCareerInsights />
    <InstitutionCareerDashboard />
  </>;
}
