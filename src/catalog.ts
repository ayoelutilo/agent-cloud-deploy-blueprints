import type { CloudProvider, ProviderBlueprintSpec } from "./types.js";

export const BLUEPRINT_CATALOG: Record<CloudProvider, ProviderBlueprintSpec> = {
  aws: {
    provider: "aws",
    requiredVars: [
      "region",
      "environment",
      "vpc_cidr",
      "private_subnet_a_cidr",
      "private_subnet_b_cidr",
      "eks_cluster_name",
      "cluster_role_arn",
      "node_role_arn",
      "node_instance_type",
      "node_desired_size"
    ],
    artifacts: [
      { file: "blueprints/aws/versions.tf", role: "provider and version constraints" },
      { file: "blueprints/aws/variables.tf", role: "input variable contract" },
      { file: "blueprints/aws/main.tf", role: "VPC, EKS cluster, node group, logs" },
      { file: "blueprints/aws/outputs.tf", role: "cluster and networking outputs" }
    ],
    resourceInventory: {
      networking: ["aws_vpc", "aws_subnet", "aws_security_group"],
      compute: ["aws_eks_cluster", "aws_eks_node_group"],
      observability: ["aws_cloudwatch_log_group"]
    }
  },
  azure: {
    provider: "azure",
    requiredVars: [
      "location",
      "environment",
      "resource_group_name",
      "vnet_cidr",
      "aks_subnet_cidr",
      "aks_cluster_name",
      "node_vm_size",
      "node_count"
    ],
    artifacts: [
      { file: "blueprints/azure/versions.tf", role: "provider and version constraints" },
      { file: "blueprints/azure/variables.tf", role: "input variable contract" },
      { file: "blueprints/azure/main.tf", role: "resource group, VNet, AKS, monitoring" },
      { file: "blueprints/azure/outputs.tf", role: "cluster and network outputs" }
    ],
    resourceInventory: {
      networking: ["azurerm_virtual_network", "azurerm_subnet"],
      compute: ["azurerm_kubernetes_cluster"],
      observability: ["azurerm_log_analytics_workspace"]
    }
  },
  gcp: {
    provider: "gcp",
    requiredVars: [
      "project_id",
      "region",
      "environment",
      "network_name",
      "subnet_cidr",
      "gke_cluster_name",
      "node_machine_type",
      "node_count"
    ],
    artifacts: [
      { file: "blueprints/gcp/versions.tf", role: "provider and version constraints" },
      { file: "blueprints/gcp/variables.tf", role: "input variable contract" },
      { file: "blueprints/gcp/main.tf", role: "VPC, subnet, GKE cluster and node pool" },
      { file: "blueprints/gcp/outputs.tf", role: "cluster and network outputs" }
    ],
    resourceInventory: {
      networking: ["google_compute_network", "google_compute_subnetwork"],
      compute: ["google_container_cluster", "google_container_node_pool"],
      observability: ["google_logging_project_sink"]
    }
  }
};

export function getBlueprintSpec(provider: CloudProvider): ProviderBlueprintSpec {
  return BLUEPRINT_CATALOG[provider];
}
