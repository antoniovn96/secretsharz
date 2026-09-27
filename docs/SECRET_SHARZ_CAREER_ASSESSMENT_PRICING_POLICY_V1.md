# Secret Sharz — Career Assessment Pricing Policy V1

## Status

Founder-locked commercial policy reference captured 27 September 2026.

## India

All prices are base prices and are **exclusive of applicable tax**.

### Individuals

- One assessment: ₹199 + applicable tax.
- Three-assessment package / Career Direction Trio: approximately ₹399 + applicable tax.

### Schools / institutions

Bulk pricing applies to **more than 10 orders (11+)**.

- One assessment: ₹199 + applicable tax.
- Three-assessment package: ₹299 + applicable tax.

Institutional pricing and negotiated contracts must remain configurable by authorised Admin/Accounts users.

## College Discovery

### Individual

- First 3 Closest Matches: free.
- All Additional Matches: ₹199 + applicable tax as one additional-match-set unlock, not per college.

### School

A school that pays **above ₹1,00,000** can sponsor College Discovery for a purchased quantity of student codes.

Example:

- Purchase 251 student codes.
- Up to 251 students can consume the entitlement.
- Unused codes remain available after an academic-year change.
- There is no automatic annual expiry under the current founder rule.
- Once 251 codes have been consumed, the school must purchase additional codes.

The entitlement ledger must track purchased, assigned/consumed and remaining quantity.

## Tax

Tax is separate from the base price.

The commerce system must support:

- country/jurisdiction;
- tax type;
- tax rate;
- effective dates;
- tax exemptions;
- tax-inclusive/exclusive display;
- invoice/tax receipt requirements.

The current India product display is tax-exclusive.

Exact tax logic for every country must be configurable by the authorised Admin/Accounts layer and must not be hard-coded into assessment scoring.

## International pricing

Secret Sharz should use **localized market pricing**, not a literal rupee-to-foreign-currency conversion.

A working positioning reference discussed for higher-income markets is around **US$5 or more** for a single assessment. Exact country prices remain Admin/Accounts-configurable and are intentionally not invented here.

## Promotional controls

Authorised Admin/Accounts users should be able to configure:

- base prices;
- country prices;
- institution/bulk prices;
- negotiated prices;
- percentage discounts;
- fixed discounts;
- coupon codes;
- start/end dates;
- usage limits;
- customer eligibility;
- product eligibility;
- country eligibility;
- festival campaigns;
- sitewide popups;
- banners;
- announcement bars;
- promotional modals.

## Separation of concerns

Keep these separate:

1. **Catalogue price** — normal configured product price.
2. **Promotion** — temporary commercial rule.
3. **Tax** — jurisdictional calculation.
4. **Entitlement** — whether a person or institution already has access.
5. **Psychometric scoring** — independent of every commercial amount.

No assessment scoring module should contain hard-coded price values.
