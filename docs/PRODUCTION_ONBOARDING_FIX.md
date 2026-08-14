# Production onboarding fix

This branch fixes the recurring profile popup for existing Secret Sharz accounts.

## Behaviour
- A genuinely incomplete profile still opens the one-time profile form.
- A completed existing profile is detected from `profileComplete`, `onboardingCompleted`, or the required legacy profile fields.
- Completed legacy profiles are migrated to `profileComplete: true` and `onboardingCompleted: true`.
- If the migration write fails, the current popup still closes locally rather than trapping the user.
- Saving a new profile writes both completion flags.
- Working professionals require their own contact number and emergency contact, not school/guardian fields.
- Profile picture remains optional.

This is intentionally isolated from the Razorpay integration branch so the production fix can be deployed independently.