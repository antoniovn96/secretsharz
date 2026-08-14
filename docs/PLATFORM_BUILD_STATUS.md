# Secret Sharz / VidyaVantage — Platform Build Status

## Baseline

Repository: `antoniovn96/secretsharz`
Branch: `codex/platform-foundation-alignment`

## Current implementation reality

The repository already contains a meaningful working foundation: Firebase Authentication, Firestore rules, server-managed custom claims, consent policy primitives, role-management APIs, security tests, substantial career functionality, specialist dashboards and a canonical platform vocabulary.

The current platform alignment audit identifies the next blocking layer as shared platform architecture rather than more specialist feature expansion.

## P0 alignment sequence

1. Canonical person/account/relationship model
2. Minor/guardian supervised onboarding
3. Consent-before-profile
4. Persistent service memberships
5. Dedicated sensitive-domain boundaries
6. AI endpoint protection
7. App Check and production claim migration gates
8. Shared dashboard shell/context

## Founder UX decision

A student should choose the primary service context once during onboarding. That choice must be persisted and reused on subsequent visits. The platform must not repeatedly ask the student whether they want Emotional Wellbeing, Learning Support or Career Planning.

Additional services can be activated later through an explicit service-management action.

## First implementation slice completed on this branch

Added:

- `src/platform/serviceMembership.js`
- `test/server/serviceMembership.test.mjs`

The service membership model provides:

- canonical service-domain validation;
- explicit membership status;
- explicit source of service selection/assignment;
- a primary service flag;
- institution scoping;
- lifecycle dates;
- deterministic logic for deciding whether initial service selection is still required.

## Next implementation slice

The next changes should connect this pure domain model to the existing onboarding/profile flow and protected persistence layer, while preserving current working behaviour.

Then implement the supervised minor/guardian architecture and move account privacy consent fully ahead of profile creation.
