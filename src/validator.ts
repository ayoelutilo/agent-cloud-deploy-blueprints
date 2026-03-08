import { getBlueprintSpec } from "./catalog.js";
import type { CloudProvider, InputVars, ValidationResult } from "./types.js";

function isMissing(value: unknown): boolean {
  if (value === null || value === undefined) {
    return true;
  }

  if (typeof value === "string" && value.trim().length === 0) {
    return true;
  }

  if (Array.isArray(value) && value.length === 0) {
    return true;
  }

  return false;
}

function asPositiveInteger(value: unknown): number | null {
  if (typeof value === "number" && Number.isInteger(value) && value > 0) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isInteger(parsed) && parsed > 0) {
      return parsed;
    }
  }

  return null;
}

export function validateDeploymentInput(provider: CloudProvider, vars: InputVars): ValidationResult {
  const spec = getBlueprintSpec(provider);
  const errors: ValidationResult["errors"] = [];
  if (!vars || typeof vars !== "object" || Array.isArray(vars)) {
    return {
      provider,
      valid: false,
      missingVars: [...spec.requiredVars],
      errors: [
        {
          code: "invalid_input_object",
          message: "deployment vars input must be a JSON object"
        }
      ]
    };
  }

  const safeVars = vars as Record<string, unknown>;
  const missingVars = spec.requiredVars.filter((name) => isMissing(safeVars[name]));

  if (missingVars.length > 0) {
    errors.push({
      code: "missing_required_vars",
      message: `Missing required variables: ${missingVars.join(", ")}`
    });
  }

  const environment = safeVars.environment;
  if (typeof environment !== "string" || !/^(dev|staging|prod)$/.test(environment)) {
    errors.push({
      code: "invalid_environment",
      message: "environment must be one of: dev, staging, prod"
    });
  }

  if (provider === "aws") {
    if (asPositiveInteger(safeVars.node_desired_size) === null) {
      errors.push({
        code: "invalid_node_desired_size",
        message: "node_desired_size must be a positive integer"
      });
    }
  }

  if (provider === "azure" || provider === "gcp") {
    if (asPositiveInteger(safeVars.node_count) === null) {
      errors.push({
        code: "invalid_node_count",
        message: "node_count must be a positive integer"
      });
    }
  }

  return {
    provider,
    valid: errors.length === 0,
    missingVars,
    errors
  };
}
