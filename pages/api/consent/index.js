import { getAdminAuth, getAdminFirestore } from '../../../src/security/firebaseAdmin.js';
import { getConsentState, getSubjectConsentState, recordConsentEvent } from '../../../src/security/consentService.js';
import { getActiveRelationship } from '../../../src/security/relationshipStore.js';
import { evaluateConsentEligibility, getStudentAgeBand } from '../../../src/security/consentEligibility.js';

export default async function handler(req, res) {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) return res.status(401).json({ error: 'Authentication required' });
  try {
    const decoded = await getAdminAuth().verifyIdToken(header.slice(7));
    const db = getAdminFirestore();
    if (req.method === 'GET') {
      const type = String(req.query.type || '');
      const subjectId = typeof req.query.subjectId === 'string' ? req.query.subjectId.trim() : '';
      const relationshipId = typeof req.query.relationshipId === 'string' ? req.query.relationshipId.trim() : '';
      if (!type) return res.status(400).json({ error: 'type is required' });
      if (!subjectId) return res.status(200).json(await getConsentState({ db, userId: decoded.uid, type }));
      if (subjectId === decoded.uid) return res.status(200).json(await getConsentState({ db, userId: decoded.uid, type }));
      if (decoded.role !== 'parent') return res.status(403).json({ error: 'Subject consent access denied' });
      const relationship = relationshipId
        ? await db.collection('relationships').doc(relationshipId).get()
        : null;
      if (relationship) {
        if (!relationship.exists) return res.status(403).json({ error: 'Subject consent access denied' });
        const data = relationship.data() || {};
        if (data.relatedPersonId !== decoded.uid || data.subjectPersonId !== subjectId || !['parent','guardian'].includes(data.type) || data.status !== 'active') return res.status(403).json({ error: 'Subject consent access denied' });
      } else if (!(await getActiveRelationship({ db, subjectPersonId: subjectId, relatedPersonId: decoded.uid, type: 'parent' }) || await getActiveRelationship({ db, subjectPersonId: subjectId, relatedPersonId: decoded.uid, type: 'guardian' }))) {
        return res.status(403).json({ error: 'Subject consent access denied' });
      }
      return res.status(200).json(await getSubjectConsentState({ db, userId: decoded.uid, subjectId, type, relationshipId: relationshipId || null }));
    }
    if (req.method === 'POST') {
      const { type, action, actorType = 'self', relationshipId = null, subjectId = null, serviceContext = null } = req.body || {};
      if (actorType === 'guardian') {
        if (!subjectId || !relationshipId || decoded.role !== 'parent') return res.status(403).json({ error: 'Authorized guardian relationship flow required' });
        const relationshipSnap = await db.collection('relationships').doc(String(relationshipId)).get();
        if (!relationshipSnap.exists) return res.status(403).json({ error: 'Authorized guardian relationship flow required' });
        const relationship = relationshipSnap.data() || {};
        if (relationship.relatedPersonId !== decoded.uid || relationship.subjectPersonId !== subjectId || !['parent','guardian'].includes(relationship.type) || relationship.status !== 'active') return res.status(403).json({ error: 'Authorized guardian relationship flow required' });
        const subject = await db.collection('users').doc(subjectId).get();
        if (!subject.exists) return res.status(404).json({ error: 'Consent subject not found' });
        const ageBand = getStudentAgeBand(subject.data() || {});
        const eligibility = evaluateConsentEligibility({ consentType: type, actorType, ageBand });
        if (!eligibility.allowed) return res.status(403).json({ error: 'Consent actor is not eligible for this service policy', code: 'CONSENT_NOT_ELIGIBLE' });
        const event = await recordConsentEvent({ db, userId: decoded.uid, subjectId, type, action, actorType, relationshipId, serviceContext });
        return res.status(201).json({ id: event.id, policyVersion: event.policyVersion });
      }
      if (actorType !== 'self') return res.status(403).json({ error: 'Non-self consent requires an authorized relationship flow' });
      const subject = await db.collection('users').doc(decoded.uid).get();
      if (!subject.exists) return res.status(404).json({ error: 'Consent subject not found' });
      const data = subject.data() || {};
      const ageBand = getStudentAgeBand(data);
      const eligibility = evaluateConsentEligibility({ consentType: type, actorType, ageBand });
      if (!eligibility.allowed) return res.status(403).json({ error: 'Consent actor is not eligible for this service policy', code: 'CONSENT_NOT_ELIGIBLE', ageBand, reason: eligibility.reason });
      const event = await recordConsentEvent({ db, userId: decoded.uid, type, action, actorType, relationshipId, serviceContext });
      return res.status(201).json({ id: event.id, policyVersion: event.policyVersion });
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Consent API error:', error);
    return res.status(400).json({ error: error.message || 'Unable to process consent' });
  }
}
