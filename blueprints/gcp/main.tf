provider "google" {
  project = var.project_id
  region  = var.region
}

resource "google_compute_network" "main" {
  name                    = var.network_name
  auto_create_subnetworks = false
}

resource "google_compute_subnetwork" "main" {
  name          = "${var.gke_cluster_name}-subnet"
  ip_cidr_range = var.subnet_cidr
  network       = google_compute_network.main.id
  region        = var.region
}

resource "google_container_cluster" "main" {
  name                     = var.gke_cluster_name
  location                 = var.region
  remove_default_node_pool = true
  initial_node_count       = 1
  network                  = google_compute_network.main.name
  subnetwork               = google_compute_subnetwork.main.name

  logging_service    = "logging.googleapis.com/kubernetes"
  monitoring_service = "monitoring.googleapis.com/kubernetes"
}

resource "google_container_node_pool" "primary" {
  name       = "${var.gke_cluster_name}-primary"
  cluster    = google_container_cluster.main.name
  location   = var.region
  node_count = var.node_count

  node_config {
    machine_type = var.node_machine_type
    oauth_scopes = ["https://www.googleapis.com/auth/cloud-platform"]
    labels = {
      environment = var.environment
    }
  }
}

resource "google_logging_project_sink" "k8s_audit" {
  name        = "${var.gke_cluster_name}-k8s-audit"
  destination = "storage.googleapis.com/${var.project_id}-audit-logs"
  filter      = "resource.type=\"k8s_cluster\""
}
