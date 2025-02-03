# agent-cloud-deploy-blueprints

Multi-cloud deployment blueprint repository with Terraform artifacts and a TypeScript validator/plan-report generator.

## Repository layout

- `blueprints/aws`: VPC + EKS blueprint.
- `blueprints/azure`: Resource Group + VNet + AKS blueprint.
- `blueprints/gcp`: VPC + GKE blueprint.
- `src`: validator, plan generator, and CLI.
- `tests`: unit tests for validation and report generation.

## Install

```bash
npm install
```

## Build

```bash
npm run build
```

## Test

```bash
npm test
```

## Generate a plan report

```bash
npm run build
node dist/cli.js --provider aws --vars-file examples/aws.vars.json --format markdown
```

Use `--out <file>` to write the report to disk.

## Validator behavior

- Verifies required variables per cloud provider.
- Enforces environment enum (`dev|staging|prod`).
- Enforces positive node sizing values.
- Produces deployment plan report including Terraform command sequence and blueprint artifact inventory.

- Changelog: minor updates.

- Changelog: minor updates.
