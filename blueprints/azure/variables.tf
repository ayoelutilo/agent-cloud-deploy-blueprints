variable "location" {
  type        = string
  description = "Azure region"
}

variable "environment" {
  type        = string
  description = "Deployment environment (dev|staging|prod)"
}

variable "resource_group_name" {
  type        = string
  description = "Resource group name"
}

variable "vnet_cidr" {
  type        = string
  description = "CIDR for virtual network"
}

variable "aks_subnet_cidr" {
  type        = string
  description = "CIDR for AKS subnet"
}

variable "aks_cluster_name" {
  type        = string
  description = "AKS cluster name"
}

variable "node_vm_size" {
  type        = string
  description = "AKS node VM size"
}

variable "node_count" {
  type        = number
  description = "AKS node count"
}
