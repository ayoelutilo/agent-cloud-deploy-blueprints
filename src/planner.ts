import { getBlueprintSpec } from "./catalog.js";
import type { CloudProvider, DeploymentPlan, InputVars } from "./types.js";
import { validateDeploymentInput } from "./validator.js";

function toEnvironment(raw: unknown): string {
  if (typeof raw === "string" && raw.trim().length > 0) {
    return raw;
  }

  return "dev";
}

function buildTerraformCommands(provider: CloudProvider): string[] {
  const baseDir = `blueprints/${provider}`;
  const varsFile = `../../examples/${provider}.vars.json`;
  return [
    `terraform -chdir=${baseDir} init`,
    `terraform -chdir=${baseDir} plan -var-file=${varsFile}`,
    `terraform -chdir=${baseDir} apply -var-file=${varsFile}`
  ];
}

export function generateDeploymentPlan(provider: CloudProvider, vars: InputVars): DeploymentPlan {
  const validation = validateDeploymentInput(provider, vars);
  const spec = getBlueprintSpec(provider);

  return {
    provider,
    environment: toEnvironment(vars.environment),
    generatedAt: new Date().toISOString(),
    valid: validation.valid,
    summary: validation.valid
      ? `${provider.toUpperCase()} deployment input validated and ready for terraform plan.`
      : `${provider.toUpperCase()} deployment input failed validation. Fix errors before planning.`,
    missingVars: validation.missingVars,
    errors: validation.errors,
    requiredVars: spec.requiredVars,
    artifacts: spec.artifacts,
    resourceInventory: spec.resourceInventory,
    commands: buildTerraformCommands(provider)
  };
}

export function formatPlanReportMarkdown(plan: DeploymentPlan): string {
  const lines: string[] = [];

  lines.push(`# ${plan.provider.toUpperCase()} Deployment Plan Report`);
  lines.push("");
  lines.push(`- Generated At: ${plan.generatedAt}`);
  lines.push(`- Environment: ${plan.environment}`);
  lines.push(`- Validation: ${plan.valid ? "PASS" : "FAIL"}`);
  lines.push("");
  lines.push("## Summary");
  lines.push(plan.summary);
  lines.push("");

  lines.push("## Required Variables");
  for (const varName of plan.requiredVars) {
    lines.push(`- ${varName}`);
  }
  lines.push("");

  if (plan.missingVars.length > 0) {
    lines.push("## Missing Variables");
    for (const missing of plan.missingVars) {
      lines.push(`- ${missing}`);
    }
    lines.push("");
  }

  if (plan.errors.length > 0) {
    lines.push("## Validation Errors");
    for (const error of plan.errors) {
      lines.push(`- [${error.code}] ${error.message}`);
    }
    lines.push("");
  }

  lines.push("## Blueprint Artifacts");
  for (const artifact of plan.artifacts) {
    lines.push(`- ${artifact.file}: ${artifact.role}`);
  }
  lines.push("");

  lines.push("## Terraform Commands");
  for (const command of plan.commands) {
    lines.push(`- ${command}`);
  }

  return `${lines.join("\n")}\n`;
}
