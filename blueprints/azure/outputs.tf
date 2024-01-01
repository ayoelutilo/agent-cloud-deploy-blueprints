output "aks_cluster_name" {
  value = azurerm_kubernetes_cluster.main.name
}

output "resource_group_name" {
  value = azurerm_resource_group.main.name
}

output "aks_subnet_id" {
  value = azurerm_subnet.aks.id
}
