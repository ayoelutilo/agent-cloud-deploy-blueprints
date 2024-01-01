output "gke_cluster_name" {
  value = google_container_cluster.main.name
}

output "network_name" {
  value = google_compute_network.main.name
}

output "subnetwork_name" {
  value = google_compute_subnetwork.main.name
}
