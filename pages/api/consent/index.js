import { getAdminAuth, getAdminFirestore } from '../../../src/security/firebaseAdmin.js';
import { getConsentState, recordConsentEvent } from '../../../src/security/consentService.js';
import { evaluateConsentEligibility, getStudentAgeBand } from '../../../src/security/consentEligibility.js';
import { getActiveRelationship } from '../../../src/security/relationshipStore.js';

export default async function handler(req, res) {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) return res.status(401).json({ error: 'Authentication required' });
  try {
    const decoded = await getAdminAuth().verifyIdToken(header.slice(7));
    const db = getAdminFirestore();

    if (req.method === 'GET') {
      const type = String(req.query.type || '');
      const subjectId = String(req.query.subjectId || '').trim();
      if (!type) return res.status(400).json({ error: 'type is required' });
      if (subjectId) {
        return res.status(200).json(await import('../../../src/security/consentService.js').then(({ getSubjectConsentState }) => getSubjectConsentState({ db, userId: decoded.uid, subjectId, type, relationshipId: req.query.relationshipId || null })));
      }
      return res.status(200).json(await getConsentState({ db, userId: decoded.uid, type }));
    }

    if (req.method === 'POST') {
      const { type, action, actorType = 'self', relationshipId = null, subjectId = null, serviceContext = null } = req.body || {};
      let consentSubjectId = decoded.uid;

      if (actorType === 'guardian') {
        if (!relationshipId || !subjectId) return res.status(400).json({ error: 'relationshipId and subjectId are required for guardian consent' });
        const relationship = await getActiveRelationship({ db, subjectPersonId: subjectId, relatedPersonId: decoded.uid, type: 'parent' })
          || await getActiveRelationship({ db, subjectPersonId: subjectId, relatedPersonId: decoded.uid, type: 'guardian' });
        if (!relationship || relationship.id !== relationshipId) return res.status(403).json({ error: 'Authorized guardian relationship required' });
        consentSubjectId = subjectId;
      } else if (actorType !== 'self') {
        return res.status(403).json({ error: 'Consent actor is not permitted' });
      }

      const subject = await db.collection('users').doc(consentSubjectId).get();
      if (!subject.exists) return res.status(404).json({ error: 'Consent subject not found' });
      const data = subject.data() || {};
      const ageBand = getStudentAgeBand(data);
      const eligibility = evaluateConsentEligibility({ consentType: type, actorType, ageBand });
      if (!eligibility.allowed) return res.status(403).json({ error: 'Consent actor is not eligible for this service policy', code: 'CONSENT_NOT_ELIGIBLE', ageBand, reason: eligibility.reason });

      const event = await recordConsentEvent({ db, userId: decoded.uid, subjectId: actorType === 'guardian' ? subjectId : null, type, action, actorType, relationshipId, serviceContext });
      return res.status(201).json({ id: event.id, policyVersion: event.policyVersion, subjectId: event.subjectId || null });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Consent API error:', error);
    return res.status(400).json({ error: 'Unable to process consent' });
  }
}
