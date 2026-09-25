# Secret Sharz — Career Assessment Personalised Reporting & Comparative Audit V1

**Status:** Founder-approved design direction — implementation/psychometric validation pending  
**Branch:** rebuild/platform-foundation-v1  
**Purpose:** Define how Secret Sharz should make career-assessment reports substantially more personalised, evidence-grounded and longitudinal than a static repeated template.

## 1. Public benchmark review

### TAMANNA
The current public TAMANNA site states that CBSE and NCERT developed TAMANNA for senior school students, especially Classes IX and X. It measures seven aptitude dimensions and provides a test booklet, technical manual, teacher/parent guide, scoring/norms and interpretation guidance. The site also explicitly states that the assessment has no pass/fail outcome, is intended to provide information about strengths and should not be used to impose subjects on students. The published technical material describes the seven dimensions as Language Aptitude, Abstract Reasoning, Verbal Reasoning, Mechanical Reasoning, Numerical Aptitude, Spatial Aptitude and Perceptual Aptitude. citeturn166453view0turn526528search25turn526528search0

### My Career Advisor
Current public My Career Advisor materials describe a broader digital career-discovery experience: aptitude, interest and value questionnaires; tailored job-role recommendations; 1,500+ career options in current published descriptions; saved and compared roles; career profiles; passion mapping; preparation guides; nearby skilling opportunities; shareable reports; bilingual/mobile-first access; videos/voiceovers; and AI-powered guidance. The programme is presented as a support tool for students, parents, teachers and counsellors. citeturn502563search1turn725590search0turn725590search20

## 2. Secret Sharz design objective

The target is not to copy or merely add more questions.

Secret Sharz should differentiate through:
- deeper evidence coverage;
- genuinely individualised report narratives;
- longitudinal change tracking;
- contradiction-aware interpretation;
- actionable education/career pathways;
- human counsellor collaboration;
- personalised next-step plans;
- transparent evidence behind every recommendation;
- student/parent/counsellor/institution-specific views.

The target is a **Career Discovery System**, not a one-time test.

## 3. Personalised report architecture

Every completed report should be assembled from structured evidence before narrative generation.

### Layer 1 — Assessment facts
Store immutable scored observations:
- construct;
- subscale;
- raw/derived score;
- normative reference where appropriate;
- version;
- completion date;
- response-quality indicators;
- instrument metadata.

### Layer 2 — Student context
Use only authorised context:
- age/grade;
- subjects;
- academic evidence;
- stated goals;
- preferred locations/languages;
- portfolio/projects;
- activities;
- previous assessment history;
- explicit career preferences.

### Layer 3 — Interpretation
Create evidence-backed statements:
- strongest signals;
- supporting signals;
- weak/mixed signals;
- contradictions;
- missing evidence;
- changes since previous assessment.

### Layer 4 — Exploration
Generate career areas and occupation/pathway candidates with evidence references.

Each recommendation must contain:
- match signals;
- caution/mixed signals;
- prerequisite information;
- what the student should investigate next;
- relevant subject/education pathways;
- recommended experiences.

### Layer 5 — Action plan
Create actions specific to the student:
- explore a career profile;
- compare two careers;
- complete a work sample;
- speak to a professional;
- try a project;
- attend a workshop;
- improve a skill;
- research a qualification;
- book counselling.

## 4. The report must not be a repeated template

The system should not generate every student report from identical paragraphs with names/scores substituted.

Instead, report content is assembled from **evidence-linked content atoms**.

Each narrative block has:
- topic;
- evidence conditions;
- applicable age/stage;
- optional localisation;
- allowed claims;
- recommended actions;
- version.

The report composer selects only blocks justified by that student's evidence.

Two students with genuinely different profiles should therefore receive materially different explanations.

Two students with genuinely identical evidence may share some statements; the system must not force artificial wording differences merely to make reports appear unique.

## 5. Anti-hallucination report rules

AI may:
- explain an assessment result;
- connect multiple authorised evidence signals;
- personalise wording;
- suggest exploration activities;
- compare supported career pathways;
- summarise a counsellor's approved annotation.

AI may not:
- invent an assessment score;
- invent academic results;
- invent interests;
- invent family circumstances;
- diagnose a student;
- claim a career is guaranteed;
- change the underlying score;
- remove an important contradiction;
- disclose data not authorised for the report audience.

Every important generated statement should be traceable to one or more evidence references in the report-generation payload.

## 6. Personalised student report

Recommended structure:

1. **Your Career Snapshot**
2. **What Stands Out About You**
3. **How You Prefer to Work**
4. **Your Strongest Evidence Signals**
5. **Where Your Signals Agree**
6. **Where Your Signals Are Mixed**
7. **Career Areas Worth Exploring**
8. **Why These Areas Appeared**
9. **Careers to Compare**
10. **Subjects and Education Pathways**
11. **Skills to Build**
12. **Experiences to Try**
13. **Questions to Discuss With a Counsellor**
14. **Your Next 30/90/180-Day Plan**
15. **What to Reassess Later**
16. **Assessment Confidence & Data Completeness**

This structure intentionally moves beyond a score sheet.

## 7. Personalisation examples

### Student A
Strong Investigative + Numerical + Scientific reasoning + Biology interest + strong academic alignment.

Report emphasis:
- research;
- healthcare/biomedical exploration;
- engineering/data/science pathways;
- scientific work samples;
- subject/qualification requirements.

### Student B
Strong Social + Communication + Creative + high service/impact values + lower numerical confidence.

Report emphasis:
- education;
- psychology;
- communication/media;
- social-sector roles;
- people-centred career environments;
- skill-building in areas the student wants to strengthen.

### Student C
High interest in Medicine but mixed aptitude/academic alignment.

The report should say the signals are mixed and recommend:
- health-career exploration;
- allied-health comparisons;
- talking through the attraction to medicine;
- checking subject prerequisites;
- targeted work samples;
- counsellor review.

It should not force or reject Medicine from one test.

## 8. Career recommendation score design

Do not expose one opaque "career score".

Internally, the engine may calculate evidence dimensions such as:
- interest fit;
- aptitude evidence;
- skill evidence;
- work-value fit;
- work-style fit;
- academic/pathway alignment;
- goal fit;
- experience evidence;
- readiness;
- data completeness.

The user-facing report should explain the signals and their strength instead of presenting a single deterministic ranking.

## 9. Confidence / data completeness

Display something such as:

**Career Profile Confidence: High**

and underneath:
- 5 assessment families completed;
- recent aptitude assessment;
- academic alignment available;
- portfolio evidence available;
- no major contradictory evidence.

The confidence indicator describes **evidence completeness/quality**, not the probability that a career recommendation will be correct.

## 10. Contradiction engine

The platform should actively detect:
- strong interest vs low supporting aptitude;
- strong values vs incompatible stated work environment;
- desired career vs missing prerequisite subject;
- student goal vs current readiness;
- repeated assessment changes;
- large unexplained score changes where validly detectable.

The report should turn contradictions into **questions and exploration actions**, not penalties.

## 11. Longitudinal report

Every new assessment contributes to the Career Journey.

The report can show:
- 2026 baseline;
- 2027 reassessment;
- new interests;
- changed values;
- developing skills;
- changed goals;
- completed experiences.

The latest profile should never erase the historical profile.

## 12. Counsellor version

The counsellor report can include:
- detailed subscale results;
- response-quality indicators;
- evidence contradictions;
- previous assessment comparisons;
- student goals;
- portfolio evidence;
- counsellor annotations;
- suggested conversation prompts;
- recommended follow-up assessments.

Counsellor annotations are separate versioned records and cannot rewrite historical automated assessment outputs.

## 13. Parent version

The parent report should be simpler:
- strengths;
- interests;
- career areas to explore;
- pathway questions;
- ways parents can support;
- suggested conversations;
- next actions.

It should avoid unnecessary sensitive information.

## 14. Institution version

Institutions receive only the authorised level of reporting:
- completion;
- aggregate trends;
- grade/cohort patterns;
- approved career-assessment reports;
- contracted service outcomes.

Individual reports are only available to authorised institutional roles and according to the purchased assessment/report entitlement.

## 15. PDF/report design

Reports should be generated as real personalised documents, not screenshots of dashboard pages.

Recommended format:
- student name/code;
- report version;
- date;
- assessment modules completed;
- visual profile;
- personalised narrative;
- career exploration cards;
- pathway diagrams;
- action plan;
- counsellor note where present;
- privacy/authorisation statement;
- assessment limitations.

The PDF should remain useful when printed and should also be accessible on mobile.

## 16. Versioning and regeneration

Every report records:
- report ID;
- student;
- source assessment versions;
- report-generation version;
- data snapshot;
- audience;
- author/automated generator;
- counsellor annotations;
- generated timestamp.

If the student completes a new assessment, generate a new report version.

Do not silently overwrite the old report.

## 17. Personalisation quality tests

Before production release, Secret Sharz should test whether:
- two materially different profiles produce materially different reports;
- changing one major assessment dimension changes relevant narrative sections;
- contradictions are surfaced;
- irrelevant content is omitted;
- scores cannot be changed by narrative generation;
- no unsupported personal facts appear;
- reports remain coherent across different assessment combinations;
- reports remain understandable for the intended age group;
- the same student receives consistent explanations across app/web/PDF.

## 18. Founder decisions incorporated

- Retake periods are construct-specific and configurable.
- Students receive results/reports, not unrestricted raw scoring keys.
- Confidence/data completeness indicators are required.
- Contradictions must be surfaced and explained.
- Counsellors may annotate recommendations without overwriting original results.
- Assessment history is longitudinal.
- TAMANNA and My Career Advisor are treated as benchmark/reference experiences; Secret Sharz must independently author or license its assessment content and reporting.

## 19. Core principle

**Personalisation must come from evidence, not random wording.**

A report is successful when a student can read it and recognise:
- what they actually answered;
- what they are currently good at;
- what they may want to explore;
- where their signals disagree;
- what they can do next;
- how the picture may change over time.
