variable "region" {
  type        = string
  description = "AWS region for deployment"
}

variable "environment" {
  type        = string
  description = "Deployment environment (dev|staging|prod)"
}

variable "vpc_cidr" {
  type        = string
  description = "CIDR range for VPC"
}

variable "private_subnet_a_cidr" {
  type        = string
  description = "CIDR for private subnet A"
}

variable "private_subnet_b_cidr" {
  type        = string
  description = "CIDR for private subnet B"
}

variable "eks_cluster_name" {
  type        = string
  description = "EKS cluster name"
}

variable "cluster_role_arn" {
  type        = string
  description = "IAM role ARN for EKS control plane"
}

variable "node_role_arn" {
  type        = string
  description = "IAM role ARN for EKS node group"
}

variable "node_instance_type" {
  type        = string
  description = "Node group EC2 instance type"
}

variable "node_desired_size" {
  type        = number
  description = "Desired size of EKS managed node group"
}
