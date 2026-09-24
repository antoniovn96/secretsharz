# Secret Sharz Website Rebuild — Execution Roadmap

Status: Controlled rebuild planning
Branch: `rebuild/platform-foundation-v1`
Primary domain: `secretsharz.com`

## 1. Founder decisions captured

- Primary production platform: AWS.
- Registrar: Namecheap.
- DNS: Route 53.
- Primary AWS region: Mumbai (`ap-south-1`), subject to final ADR/account setup.
- Infrastructure as Code: Terraform.
- Environments: Development, Staging, Production.
- Firebase: temporary migration bridge; not the target source of truth.
- Data migration: selective, domain-by-domain, with validation and reconciliation.
- Authentication: Amazon Cognito plus a separate Secret Sharz Person/Account/Assurance/Authorisation model.
- Authentication methods: email/passwordless OTP, phone OTP and Google.
- Existing application: preserved; migration from A -> B rather than a destructive rewrite.
- Frontend framework migration: not combined with the rebuild initially; legacy Pages Router remains isolated while the platform foundation is built.
- Public website and product application are both part of the new website program.
- Blogs: preserved as a first-class public content system, initially sourced from GitHub and later migrated to a controlled publishing workflow.
- Blog administration: SuperAdmin first; admin-approved editors later.
- VidyaVantage: a separate brand/product experience from Secret Sharz.
- UX direction: child-friendly, approachable, modern, accessible, image-rich and safe.

## 2. Target production architecture

Internet
-> Route 53
-> AWS WAF
-> CloudFront
-> Application Load Balancer
-> ECS/Fargate
-> Secret Sharz web/API services

Canonical platform data:
- Amazon RDS for PostgreSQL
- Amazon S3 for objects/media/files
- ElastiCache Redis for cache/ephemeral coordination
- EventBridge + SQS for events/jobs/retries
- OpenSearch or approved equivalent for derived search
- Secrets Manager for runtime secrets
- KMS for encryption keys
- CloudWatch + OpenTelemetry for observability

Authentication:
- Amazon Cognito
- Secret Sharz identity, assurance, roles, relationships, consent and authorisation remain application/domain authorities.

## 3. Website structure

Public Secret Sharz:
- Home
- About
- How Secret Sharz Works
- Counselling
- Psychology
- SEN
- Professionals
- Learning
- Community
- Opportunities
- Research
- Resources
- Blog
- Contact
- Login / Join

Separate VidyaVantage experience:
- Distinct visual identity and navigation.
- Connected to the same underlying Secret Sharz ecosystem only where the canonical architecture permits.

Product application:
- One Person
- One lifelong Secret Sharz Identity
- My Journey
- Relationships
- Goals
- Consent
- Role/context switching
- Domain workspaces behind the shared platform foundation.

## 4. Blog strategy

Do not keep blog content as the long-term content database.

Migration path:
1. Preserve existing blog URLs and assets.
2. Inventory existing JSX blog posts and metadata.
3. Convert content into structured Markdown/MDX plus frontmatter.
4. Store production blog media in private/publicly controlled S3 locations according to sensitivity.
5. Deliver public images and web assets through CloudFront.
6. Keep GitHub as the initial controlled authoring source.
7. Add SuperAdmin publishing controls.
8. Add admin-approved editor workflow after the initial publishing system is stable.
9. Preserve SEO metadata, canonical URLs, internal links, categories, dates, featured posts and sitemap coverage.

## 5. Migration strategy

Never perform a blind database copy.

Legacy Firebase:
- inventory
- classify
- map to canonical object
- validate
- migrate
- reconcile
- preserve provenance
- retire legacy path only after acceptance

Sensitive domains receive separate migration treatment.

## 6. Execution phases

### Phase 0 — AWS + domain bootstrap
Founder actions:
- create new AWS account using a dedicated, retained account-control email
- enable MFA on root account
- create day-to-day administrative access
- keep root access for root-only tasks only
- create Route 53 public hosted zone for `secretsharz.com`
- point Namecheap nameservers to the Route 53 nameservers
- verify DNS delegation

Engineering:
- prepare Terraform repository structure
- define environments
- define naming/tagging conventions
- define security boundaries
- document ADRs

### Phase 1 — AWS foundation
- VPC
- subnets and routing
- security groups
- WAF
- CloudFront
- ALB
- ECS/Fargate
- ECR
- S3
- RDS PostgreSQL
- Redis
- SQS/EventBridge
- Secrets Manager
- KMS
- CloudWatch
- IAM roles

### Phase 2 — CI/CD
- GitHub Actions
- GitHub OIDC trust
- Terraform validation/plan/apply workflow
- application build/test workflow
- staging deployment
- production deployment gate
- no long-lived AWS secrets in GitHub

### Phase 3 — identity foundation
- Cognito
- email OTP/passwordless
- phone OTP
- Google sign-in
- Secret Sharz Account
- Person
- assurance
- session model
- audit events

### Phase 4 — platform authorisation
- roles
- relationships
- consent
- context
- permission evaluation
- server-side enforcement
- audit trail

### Phase 5 — public website
- new child-friendly design system
- typography
- colour system
- responsive components
- imagery
- accessibility foundation
- Secret Sharz public navigation
- VidyaVantage separated from the Secret Sharz brand experience

### Phase 6 — blog migration
- inventory existing posts
- content extraction
- MDX/frontmatter conversion
- image migration to S3
- canonical URLs
- redirects
- sitemap
- structured metadata
- SuperAdmin publishing

### Phase 7 — My Journey
- Person context
- Journey timeline
- relationships
- goals
- notifications
- profile
- privacy/visibility controls

### Phase 8 — specialist domains
Reintroduce legacy capabilities progressively:
- counselling
- psychology
- SEN
- career/VidyaVantage
- professional
- learning
- community
- institutions
- opportunities
- research
- commerce

Each domain must attach to the shared platform foundation instead of creating its own identity or permission system.

### Phase 9 — selective legacy migration
- existing ~10 users
- legacy profile data
- validated domain data
- reconciliation
- controlled Firebase retirement

### Phase 10 — production cutover
- final DNS
- production certificates
- monitoring
- backup/restore verification
- security verification
- accessibility verification
- rollback plan
- staged release

## 7. First implementation rule

Do not add a major specialist feature until the shared foundation exists.

Target first milestone:
`Person -> Account -> Authentication -> Assurance -> Roles -> Relationships -> Consent -> Authorisation -> My Journey`

