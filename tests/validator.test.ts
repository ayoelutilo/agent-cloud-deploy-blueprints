import { describe, expect, it } from "vitest";
import { validateDeploymentInput } from "../src/validator.js";

describe("validateDeploymentInput", () => {
  it("returns missing required vars for AWS", () => {
    const result = validateDeploymentInput("aws", {
      environment: "dev",
      region: "example-region-1"
    });

    expect(result.valid).toBe(false);
    expect(result.missingVars).toContain("vpc_cidr");
    expect(result.errors.some((error) => error.code === "missing_required_vars")).toBe(true);
  });

  it("fails when node_count is invalid for Azure", () => {
    const result = validateDeploymentInput("azure", {
      location: "example-location-1",
      environment: "dev",
      resource_group_name: "example-resource-group",
      vnet_cidr: "10.20.0.0/16",
      aks_subnet_cidr: "10.20.1.0/24",
      aks_cluster_name: "example-aks-cluster",
      node_vm_size: "Standard_D4s_v5",
      node_count: 0
    });

    expect(result.valid).toBe(false);
    expect(result.errors.some((error) => error.code === "invalid_node_count")).toBe(true);
  });

  it("passes for complete GCP variables", () => {
    const result = validateDeploymentInput("gcp", {
      project_id: "example-project-id",
      region: "example-region-1",
      environment: "dev",
      network_name: "example-network",
      subnet_cidr: "10.30.0.0/20",
      gke_cluster_name: "example-gke-cluster",
      node_machine_type: "e2-standard-4",
      node_count: 3
    });

    expect(result.valid).toBe(true);
    expect(result.missingVars).toEqual([]);
    expect(result.errors).toEqual([]);
  });

  it("returns structured validation for invalid input shape", () => {
    const result = validateDeploymentInput("aws", null as unknown as Record<string, unknown>);

    expect(result.valid).toBe(false);
    expect(result.errors.some((error) => error.code === "invalid_input_object")).toBe(true);
    expect(result.missingVars.length).toBeGreaterThan(0);
  });
});
