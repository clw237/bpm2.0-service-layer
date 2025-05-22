output "prefix" {
  value = local.prefix
}
output "environment" {
  value = var.environment
}
output "location" {
  value = var.location
}
output "location_abbreviation" {
  value = local.location_map
}
output "organization" {
  value = var.organization
}
output "all_resource_types" {
  value = local.all_resource_types
}

output "generator" {
  value = var.generator
}
output "generated_names" {
  value = local.generated_names
}
