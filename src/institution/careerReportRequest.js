export async function fetchInstitutionCareerReport({institutionId, rosterId, getToken, fetchImpl=fetch}) {
  if (!institutionId || !rosterId) throw new Error('Institution and student record are required.');
  const token=await getToken();
  const response=await fetchImpl(`/api/institution/student-report?institutionId=${encodeURIComponent(institutionId)}&rosterId=${encodeURIComponent(rosterId)}`,{headers:{Authorization:`Bearer ${token}`}});
  const payload=await response.json();
  if(!response.ok) throw new Error(payload?.error||'Unable to load the career report.');
  return payload;
}
