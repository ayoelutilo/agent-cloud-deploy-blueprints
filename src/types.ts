export type CloudProvider = "aws" | "azure" | "gcp";

export type InputVars = Record<string, unknown>;

export interface ValidationMessage {
  code: string;
  message: string;
}

export interface ValidationResult {
  provider: CloudProvider;
  valid: boolean;
  missingVars: string[];
  errors: ValidationMessage[];
}

export interface BlueprintArtifact {
  file: string;
  role: string;
}

export interface ResourceInventory {
  networking: string[];
  compute: string[];
  observability: string[];
}

export interface ProviderBlueprintSpec {
  provider: CloudProvider;
  requiredVars: string[];
  artifacts: BlueprintArtifact[];
  resourceInventory: ResourceInventory;
}

export interface DeploymentPlan {
  provider: CloudProvider;
  environment: string;
  generatedAt: string;
  valid: boolean;
  summary: string;
  missingVars: string[];
  errors: ValidationMessage[];
  requiredVars: string[];
  artifacts: BlueprintArtifact[];
  resourceInventory: ResourceInventory;
  commands: string[];
}
