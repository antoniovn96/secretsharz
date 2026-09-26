# Secret Sharz — Assessment Commerce Model V1

**Status:** Founder product decision  
**Version:** 1.0  
**Branch:** `rebuild/platform-foundation-v1`

## 1. Core decision

Secret Sharz career assessments are **separate products**, not one mandatory master test.

Each assessment module can be:

- purchased separately;
- priced separately;
- completed separately;
- scored separately;
- reported separately;
- retaken according to its own retake policy;
- reused later in a larger integrated career profile.

Two or more separate assessments can also be combined into a commercial package.

## 2. Three-layer model

### Layer A — Assessment Module

The psychometric or career-development instrument itself.

Examples:

- Career Interest Inventory / RIASEC
- Career Aptitude & Reasoning
- Work Values
- Personality / Work Style
- Career Decision Readiness
- Career Adaptability
- Work Environment Preferences
- future Secret Sharz modules

The module owns its:

- instrument ID;
- instrument version;
- item bank;
- scoring version;
- result schema;
- report definition;
- retake rules.

### Layer B — Assessment Product

The independently purchasable commercial item mapped to exactly one assessment module.

Example:

```
Assessment Module
career_interest_inventory
        ↓
Commercial Product
ASSESSMENT_INTERESTS
        ↓
Price key
assessment_interest
```

Different assessment products may have different prices.

A product price must not be embedded into scoring or assessment logic.

### Layer C — Assessment Package

A package combines two or more independently identifiable assessment products.

Example:

```
Career Direction Package
    ├── RIASEC / Career Interests
    ├── Aptitude & Reasoning
    ├── Work Values
    └── Career Decision Readiness
```

A package can have its own configured price and discount rule.

The package does **not** create a new assessment identity.

## 3. Package and result behaviour

When a customer buys a package, Secret Sharz grants entitlement to the constituent assessment modules.

The platform must preserve the individual results:

```
Package Purchase
      ↓
Module Entitlements
      ├── Interest
      ├── Aptitude
      ├── Values
      └── Decision Readiness
           ↓
Separate Assessment Results
           ↓
Optional Integrated Career Profile
```

The integrated profile is an interpretation layer above the individual results.

It must never replace or overwrite the underlying assessment results.

## 4. No forced retesting

Suppose a student already completed:

- RIASEC;
- Work Values.

Later they purchase a package containing:

- RIASEC;
- Aptitude;
- Work Values;
- Decision Readiness.

Secret Sharz should unlock:

- existing valid RIASEC result;
- existing valid Work Values result;
- new Aptitude assessment;
- new Decision Readiness assessment.

The student should **not** be forced to retake valid assessments merely because they purchased a larger package.

## 5. Pricing model

Prices are commercial configuration, not assessment configuration.

Each standalone product receives an independent price key.

Examples:

```
assessment_interest
assessment_aptitude
assessment_values
assessment_personality
assessment_readiness
```

Packages receive separate price keys:

```
package_interest_values
package_career_direction
package_full_career_intelligence
```

This allows Secret Sharz to support:

- different standalone prices;
- bundle discounts;
- promotional pricing;
- institutional pricing;
- student pricing;
- counsellor-issued entitlements;
- coupons;
- region/currency-specific pricing.

The assessment engine should never contain hard-coded commercial amounts.

## 6. Delivery experience

A package may be delivered as:

- separate assessments completed one after another; or
- one continuous guided experience with clear module boundaries.

This is a **delivery UX decision**, not an assessment identity decision.

Regardless of presentation:

- module results remain separate;
- module versions remain separate;
- scoring remains module-specific;
- entitlements remain traceable to modules;
- reassessment remains module-specific.

## 7. Reporting

Every standalone assessment can produce its own report.

A package may additionally generate an integrated report that references multiple completed assessment results.

Example:

```
RIASEC Report
Aptitude Report
Values Report
Decision Readiness Report
        ↓
Integrated Career Direction Report
```

The integrated report should identify which evidence was available and which modules were not completed.

It must not fabricate missing evidence.

## 8. Commercial examples

Illustrative only — actual prices will be configured separately.

| Product | Type |
|---|---|
| Career Interest / RIASEC | Standalone |
| Aptitude & Reasoning | Standalone |
| Work Values | Standalone |
| Personality / Work Style | Standalone |
| Career Decision Readiness | Standalone |
| Career Adaptability | Standalone |
| Work Environment Preferences | Standalone |
| RIASEC + Values | Package |
| RIASEC + Aptitude + Values | Package |
| Career Direction | Package |
| Full Career Intelligence | Package |

## 9. Longitudinal behaviour

A person's assessment history is a collection of versioned observations.

For example:

```
2026
  RIASEC V1
  Work Values V1

2027
  RIASEC V2
  Aptitude V1
  Decision Readiness V2
```

A later result does not erase the earlier result.

The Career Journey can therefore show change over time.

## 10. Product administration requirements

The future admin/commercial layer should allow authorised administrators to configure:

- product name;
- product SKU;
- assessment module;
- standalone price;
- currency;
- tax treatment;
- availability;
- audience;
- package composition;
- package price;
- discount;
- validity period;
- retake entitlement;
- report entitlement;
- institutional pricing.

These settings must remain separate from the psychometric scoring engine.

## 11. Canonical rule

> **Every assessment is independently runnable, independently scored, independently reportable, independently priceable, and independently purchasable. Multiple assessments may be composed into packages without merging their underlying assessment identities.**

This is the commercial foundation for the Secret Sharz Career Assessment Engine.
