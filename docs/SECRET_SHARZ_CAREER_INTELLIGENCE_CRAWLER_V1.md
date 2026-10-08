# Secret Sharz Career Intelligence Crawler v1

## Purpose

The crawler is a **staging / evidence-acquisition layer** for the Career Intelligence platform.

It must:

1. discover and fetch authoritative education, TVET, qualification, institution and pathway sources;
2. preserve the raw source identifier and source wording;
3. create a clean human-facing display name;
4. normalize source-specific programme/institution records into a common staging shape;
5. preserve source variants instead of creating false duplicates;
6. attach source URL, authority, academic/effective year and verification state;
7. never silently promote scraped data directly into canonical production records.

## Critical naming rule

Source identifiers must never be prepended to human-facing names.

For example:

- source: `1006-Government Polytechnic, Murtijapur`
- `source_institution_code = "1006"`
- `institution_display_name = "Government Polytechnic, Murtijapur"`

The same rule applies to programme/admission choice codes.

## Canonical/staging split

```
Authoritative source
      |
      v
Crawler fetch
      |
      v
Raw source snapshot
      |
      v
Parser / normalizer
      |
      v
Staging records
      |
      v
Identity resolution
      |
      v
Human / governed adjudication
      |
      v
Canonical record
      |
      v
Production projection
```

The crawler must not write directly to `program_offerings` or other canonical production tables.

## International pathway model

Crawler records must support:

- country
- jurisdiction
- subsystem
- local education stage
- transition point
- pathway
- programme / trade
- qualification
- credential
- eligibility
- assessment
- progression / transfer
- apprenticeship / work-based learning
- RPL / informal learning recognition
- provider
- regulator
- awarding body
- regional variation
- source evidence
- effective dates
- implementation status

## Current first adapter

The first concrete adapter is **Directorate of Technical Education, Maharashtra**, because its official catalogue exposes institution codes, course/choice codes, names, status and intake.

The current DTE source is useful as both:
- current-year admission evidence where the current cycle is explicitly identified; and
- historical evidence for older catalogue years.

The crawler must retain `academic_year` and must never label an older catalogue as current without a current-source confirmation.

## Planned source adapters

- DTE Maharashtra
- other Indian state technical-education/admission authorities
- national qualification frameworks
- ministries of education
- TVET regulators
- apprenticeship authorities
- examination authorities
- recognized institutional admissions sources
- regional qualification bodies
- international reference sources used only for normalization/context

## Verification states

`DISCOVERED`  
`FETCHED`  
`PARSED`  
`NORMALIZED`  
`SOURCE_VERIFIED`  
`PARTIALLY_VERIFIED`  
`CONFLICT_REQUIRES_REVIEW`  
`QUARANTINED`  
`SUPERSEDED`

## Duplicate handling

The crawler should not deduplicate solely on source code.

It should preserve:

- source code(s)
- raw source name(s)
- normalized name
- canonical candidate key
- provider/jurisdiction context
- academic/effective year

Choice-code suffixes such as `T` must remain source variants unless an authoritative source establishes that they represent a distinct programme.

## Safety

Production deployment, canonical database writes and R86/R9 governed promotion remain separate operations and require their existing authorization contracts.
