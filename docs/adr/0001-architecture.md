# ADR 0001: Multi-Cloud Blueprint + Validation Split

- Status: Accepted
- Date: 2024-06-15

## Context
Deployment blueprints for AWS, Azure, and GCP are often maintained separately from the automation that validates release-time variables. Missing or malformed variables can break CI/CD late in the process.

## Decision
Store cloud blueprints and deployment-input validation together in one repository:

1. Terraform artifacts per provider in `blueprints/<provider>/`.
2. TypeScript validator to enforce required variables and basic semantic constraints.
3. Plan generator producing a machine-readable and human-readable report.
4. CLI that can be integrated into CI as a pre-plan guard.

## Consequences
- Positive:
  - One source of truth for variable requirements and blueprint inventory.
  - CI can fail fast before expensive provider plan/apply operations.
  - Report output is suitable for PR artifacts and approvals.
- Trade-offs:
  - Catalog metadata must stay synchronized with Terraform files.
  - Validator currently checks common constraints, not full provider-specific policy rules.

- Changelog: minor updates.

- Changelog: minor updates.
