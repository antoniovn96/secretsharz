import React from 'react';
import InstitutionCareerDashboard from '../../../src/institution/InstitutionCareerDashboard';
import InstitutionCareerInsights from '../../../src/institution/InstitutionCareerInsights';
import {InstitutionCareerDataProvider} from '../../../src/institution/InstitutionCareerDataContext';

export default function InstitutionCareerPage(){
  return <InstitutionCareerDataProvider>
    <InstitutionCareerInsights />
    <InstitutionCareerDashboard />
  </InstitutionCareerDataProvider>;
}
