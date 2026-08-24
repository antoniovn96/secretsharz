import {useInstitutionCareerData} from './InstitutionCareerDataContext';

/**
 * Shared institutional server-data adapter for the career dashboard.
 * UI-only state (filters, roster-file parsing, selected report, etc.) remains
 * in InstitutionCareerDashboard; this hook owns only server-backed data.
 */
export default function useInstitutionCareerDashboardData(){
  const {institution,students,summary,analytics,loading,error,refresh}=useInstitutionCareerData();
  return {institution,students,summary,analytics,loading,error,refresh};
}
