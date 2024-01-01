variable "project_id" {
  type        = string
  description = "GCP project ID"
}

variable "region" {
  type        = string
  description = "GCP region"
}

variable "environment" {
  type        = string
  description = "Deployment environment (dev|staging|prod)"
}

variable "network_name" {
  type        = string
  description = "VPC network name"
}

variable "subnet_cidr" {
  type        = string
  description = "Subnet CIDR range"
}

variable "gke_cluster_name" {
  type        = string
  description = "GKE cluster name"
}

variable "node_machine_type" {
  type        = string
  description = "Machine type for node pool"
}

variable "node_count" {
  type        = number
  description = "Node count for primary node pool"
}
