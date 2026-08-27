// Secret Sharz — onboarding integration plan
// Pure decision helpers. Persistence must happen through trusted domain services.

import { buildPersonAccountState } from './personAccountModel';
import { choosePrimaryStudentService, shouldAskForInitialServiceSelection } from './serviceMembership';

export function getOnboardingStep({
  onboardingComplete = false,
  accountState,
  memberships = [],
  consentGranted = false,
  guardianApproved = false,
}) {
  if (onboardingComplete) return { step: 'complete' };
  if (!accountState?.accountStatus || accountState.accountStatus === 'pending_consent') {
    if (!consentGranted) return { step: 'account_consent' };
  }

  if (accountState?.guardianRequired && !guardianApproved) {
    return { step: 'guardian_verification' };
  }

  if (shouldAskForInitialServiceSelection({ onboardingComplete, memberships })) {
    return { step: 'service_selection' };
  }

  if (accountState?.profileStatus !== 'complete') {
    return { step: 'profile' };
  }

  return { step: 'complete' };
}

export function buildOnboardingState({ uid, age, consentGranted, guardianApproved, memberships = [] }) {
  const accountState = buildPersonAccountState({
    uid,
    age,
    accountStatus: consentGranted ? 'pending_guardian' : 'pending_consent',
    profileStatus: 'not_created',
  });

  return {
    accountState,
    primaryService: choosePrimaryStudentService(memberships),
    next: getOnboardingStep({
      accountState,
      memberships,
      consentGranted,
      guardianApproved,
    }),
  };
}
