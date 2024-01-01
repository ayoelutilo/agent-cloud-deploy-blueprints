provider "aws" {
  region = var.region

  default_tags {
    tags = {
      project     = "agent-cloud-deploy-blueprints"
      environment = var.environment
      managed_by  = "terraform"
    }
  }
}

resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "${var.eks_cluster_name}-vpc"
  }
}

resource "aws_subnet" "private_a" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = var.private_subnet_a_cidr
  availability_zone = "${var.region}a"

  tags = {
    Name = "${var.eks_cluster_name}-private-a"
  }
}

resource "aws_subnet" "private_b" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = var.private_subnet_b_cidr
  availability_zone = "${var.region}b"

  tags = {
    Name = "${var.eks_cluster_name}-private-b"
  }
}

resource "aws_security_group" "eks_control_plane" {
  name        = "${var.eks_cluster_name}-control-plane"
  description = "Control plane access policy"
  vpc_id      = aws_vpc.main.id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_cloudwatch_log_group" "eks" {
  name              = "/aws/eks/${var.eks_cluster_name}/cluster"
  retention_in_days = 30
}

resource "aws_eks_cluster" "main" {
  name     = var.eks_cluster_name
  role_arn = var.cluster_role_arn

  vpc_config {
    subnet_ids         = [aws_subnet.private_a.id, aws_subnet.private_b.id]
    security_group_ids = [aws_security_group.eks_control_plane.id]
  }

  enabled_cluster_log_types = ["api", "audit", "authenticator"]

  depends_on = [aws_cloudwatch_log_group.eks]
}

resource "aws_eks_node_group" "main" {
  cluster_name    = aws_eks_cluster.main.name
  node_group_name = "${var.eks_cluster_name}-nodes"
  node_role_arn   = var.node_role_arn
  subnet_ids      = [aws_subnet.private_a.id, aws_subnet.private_b.id]

  scaling_config {
    desired_size = var.node_desired_size
    min_size     = 1
    max_size     = 6
  }

  instance_types = [var.node_instance_type]
}
