// Secret Sharz — canonical counselling case discovery (SERVER-ONLY).
// Discovers cases from first-class relationships only; it does not inspect or mutate legacy assignments.
export async function discoverCounsellingCases({ db, limit = 500 }) {
  if (!db) throw new Error('Firestore instance is required.');
  const snapshot = await db.collection('relationships').where('domain', '==', 'counselling').where('status', '==', 'active').limit(Math.min(Math.max(Number(limit) || 1, 1), 500)).get();
  return snapshot.docs.map(doc => {
    const relationship = { id: doc.id, ...doc.data() };
    return { relationshipId: relationship.id, studentId: relationship.subjectPersonId, professionalId: relationship.relatedPersonId, relationshipType: relationship.type, status: relationship.status, domain: relationship.domain };
  });
}
