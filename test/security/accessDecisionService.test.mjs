import test from 'node:test';
import assert from 'node:assert/strict';
import { decideAccess } from '../../src/security/accessDecisionService.js';

const base = { actor:{uid:'c1',role:'counsellor'}, studentId:'s1', institutionId:'i1', service:'wellbeing', domain:'counselling', relationship:{status:'active',domain:'counselling',metadata:{service:'wellbeing'}}, consent:{required:true,status:'active'}, safeguarding:{restricted:false} };

test('allows matching active relationship and consent', () => assert.equal(decideAccess(base).allowed, true));
test('denies service mismatch', () => assert.equal(decideAccess({...base, relationship:{...base.relationship,metadata:{service:'career'}}}).allowed, false));
test('denies inactive consent when required', () => assert.equal(decideAccess({...base, consent:{required:true,status:'ended'}}).allowed, false));
test('denies restricted safeguarding for non-admin', () => assert.equal(decideAccess({...base, safeguarding:{restricted:true}}).allowed, false));
