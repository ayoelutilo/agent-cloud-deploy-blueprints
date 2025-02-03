import { describe, expect, it } from "vitest";
import { formatPlanReportMarkdown, generateDeploymentPlan } from "../src/planner.js";

describe("generateDeploymentPlan", () => {
  it("includes terraform commands and artifacts on valid plan", () => {
    const plan = generateDeploymentPlan("aws", {
      region: "example-region-1",
      environment: "dev",
      vpc_cidr: "10.10.0.0/16",
      private_subnet_a_cidr: "10.10.1.0/24",
      private_subnet_b_cidr: "10.10.2.0/24",
      eks_cluster_name: "example-eks-dev",
      cluster_role_arn: "arn:aws:iam::<AWS_ACCOUNT_ID>:role/<EKS_CLUSTER_ROLE>",
      node_role_arn: "arn:aws:iam::<AWS_ACCOUNT_ID>:role/<EKS_NODE_ROLE>",
      node_instance_type: "m6i.large",
      node_desired_size: 3
    });

    expect(plan.valid).toBe(true);
    expect(plan.commands[0]).toContain("terraform -chdir=blueprints/aws init");
    expect(plan.artifacts.some((artifact) => artifact.file === "blueprints/aws/main.tf")).toBe(true);
  });

  it("renders markdown report with validation failures", () => {
    const plan = generateDeploymentPlan("azure", {
      environment: "invalid",
      location: "example-location-1"
    });

    const report = formatPlanReportMarkdown(plan);
    expect(plan.valid).toBe(false);
    expect(report).toContain("Validation: FAIL");
    expect(report).toContain("Missing Variables");
    expect(report).toContain("invalid_environment");
  });
});

// Refinement.
