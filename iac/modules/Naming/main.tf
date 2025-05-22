locals {
  location_map = {
    #TODO other regions to be added
    asiapacific    = "ap1"
    northvirginia  = "use1",
    ohio           = "use2",
    westeurope     = "ew",
    bahrain        = "ms1",
    uae            = "mc1"
  }

  location_map_reverse = zipmap(values(local.location_map), keys(local.location_map))

  domain_map = {
    job_architecture    = "ja"
    success_profile     = "sp"
    employee_experience = "ee"
    core                = "cr"
    client_data         = "cd"
    data_science        = "ds"
    internal_mobility   = "im"
    platform_fabric     = "pf"
    analytics_dashboard = "ad"
  }

  environment_map = {
    sandbox                   = "sbx"
    development               = "dev"
    quality_assurance         = "qa1"
    staging                   = "stg"
    production                = "prd"
  }

  environment_map_reverse = zipmap(values(local.environment_map), keys(local.environment_map))

  #TODO Sort resources types alphabetically
  resource_types = {
    # active_directory_domain_services = {
    #   name     = "active_directory_domain_services"
    #   alphanum = false
    #   global   = false
    #   abbr     = "adds"
    # }
    # api_gateway = {
    #   name     = "api_gateway"
    #   alphanum = false
    #   global   = false
    #   abbr     = "apigw"
    # }
    # alb = {
    #   name     = "lb"
    #   alphanum = false
    #   global   = false
    #   abbr     = "lb"
    # }
    # auto_scaling_group = {
    #   name     = "auto_scaling_group"
    #   alphanum = false
    #   global   = false
    #   abbr     = "asg-linux"
    # }
    # elastic_beanstalk = {
    #   name     = "elastic_beanstalk"
    #   alphanum = false
    #   global   = false
    #   abbr     = "esbean"
    # }
    # elastic_beanstalk_domain = {
    #   name     = "elastic_beanstalk_domain"
    #   alphanum = false
    #   global   = false
    #   abbr     = "esbenv"
    # }
    appconfig_app = {
      name     = "appconfig_app"
      alphanum = false
      global   = false
      abbr     = "app"
    }
    cloud_watch = {
      name     = "cloud_watch"
      alphanum = false
      global   = false
      abbr     = "cw"
    }
     security_group = {
      name     = "security_group"
      alphanum = false
      global   = false
      abbr     = "sg"
    }

    instance_profile = {
      name     = "instance_profile"
      alphanum = false
      global   = false
      abbr     = "instprof"
    }

    launch_template = {
      name     = "launch_template"
      alphanum = false
      global   = false
      abbr     = "ltmpl"
    }

    autoscaling_group = {
      name     = "autoscaling_group"
      alphanum = false
      global   = false
      abbr     = "asg"
    }

    bastion = {
      name     = "bastion"
      alphanum = false
      global   = false
      abbr     = "bas"
    }
    cdn_endpoint = {
      name     = "cdn_endpoint"
      alphanum = false
      global   = false
      abbr     = "cdne"
    }
    cdn_profile = {
      name     = "cdn_profile"
      alphanum = false
      global   = false
      abbr     = "cdn"
    }
    cloudwatch_log_group = {
      name     = "cloudwatch_log_group"
      alphanum = false
      global   = false
      abbr     = "loggrp"
    }
    container_instance = {
      name     = "container_instance"
      alphanum = false
      global   = false
      abbr     = "ecs"
    }
    container_registry = {
      name     = "container_registry"
      alphanum = false
      global   = false
      abbr     = "ecr"
    }
    iam_role  = {
      name     = "iam_role"
      alphanum = false
      global   = false
      abbr     = "iamrole"
    }
    iam_policy  = {
      name     = "iam_policy"
      alphanum = false
      global   = false
      abbr     = "iampolicy"
    }
    iam_group  = {
      name     = "iam_group"
      alphanum = false
      global   = false
      abbr     = "iamgroup"
    }
    lambda_function  = {
      name     = "lambda_function"
      alphanum = false
      global   = false
      abbr     = "lmdfn"
    }
    databricks = {
      name = "databricks"
      alphanum = false
      global   = false
      abbr     = "dlkb"
    }
    databricks_workspace = {
      name     = "databricks_workspace"
      alphanum = false
      global   = false
      abbr     = "adbr"
    }
    endpoint  = {
      name  = "endpoint"
      alphanum = false
      global   = false
      abbr     = "ep"
    }
    elastic_ip = {
      name     = "elastic_ip"
      alphanum = false
      global   = false
      abbr     = "eip"
    }
    image = {
      name     = "image"
      alphanum = false
      global   = false
      abbr     = "img"
    }
    kubernetes_cluster = {
      name     = "kubernetes_cluster"
      alphanum = false
      global   = false
      abbr     = "eks"
    }
    kubernetes_cluster_node_group = {
      name     = "kubernetes_cluster_node_group"
      alphanum = false
      global   = false
      abbr     = "eksng"
    }
    lb_backend_target_group = {
      name     = "lb_backend_target_group"
      alphanum = false
      global   = false
      abbr     = "lbtg"
    }
    # linux_virtual_machine = {
    #   name     = "linux_virtual_machine"
    #   alphanum = false
    #   global   = false
    #   abbr     = "vm-linux"
    # }
    # load_balancer_virtual_ip = {
    #   name     = "load_balancer_virtual_ip"
    #   alphanum = false
    #   global   = false
    #   abbr     = "lbv"
    # }
    managed_disk = {
      name     = "managed_disk"
      alphanum = false
      global   = false
      abbr     = "ebs"
    }
    managed_kafka_prov = {
      name     = "managed_kafka_prov"
      alphanum = false
      global   = false
      abbr     = "mskp"
    }
    managed_kafka_serv = {
      name     = "managed_kafka_serv"
      alphanum = false
      global   = false
      abbr     = "msks"
    }
    rabbitmq = {
      name     = "rabbitmq"
      alphanum = false
      global   = false
      abbr     = "mq"
    }
    # mysql_database = {
    #   name     = "mysql_database"
    #   alphanum = false
    #   global   = false
    #   abbr     = "mysql"
    # }
    # mysql_server = {
    #   name     = "mysql_server"
    #   alphanum = false
    #   global   = false
    #   abbr     = "msql"
    # }
    # maps_account = {
    #   name     = "maps_account"
    #   alphanum = false
    #   global   = false
    #   abbr     = "maps"
    # }
    nat_gateway = {
      name     = "nat_gateway"
      alphanum = false
      global   = false
      abbr     = "natgw"
    }
    network_interface = {
      name     = "network_interface"
      alphanum = false
      global   = false
      abbr     = "nic"
    }
    # openai = {
    #   name     = "openai"
    #   alphanum = false
    #   global   = false
    #   abbr     = "oai"
    # }
    postgresql_server = {
      name     = "postgresql_server"
      alphanum = false
      global   = false
      abbr     = "psql"
    }
    postgresql_database = {
      name     = "postgresql_database"
      alphanum = false
      global   = false
      abbr     = "psqldb"
    }
    # private_dns_a_record = {
    #   name     = "private_dns_a_record"
    #   alphanum = false
    #   global   = false
    #   abbr     = "pdnsar"
    # }
    # private_dns_zone = {
    #   name     = "private_dns_zone"
    #   alphanum = false
    #   global   = false
    #   abbr     = "pdnsz"
    # }
    # private_endpoint = {
    #   name     = "private_endpoint"
    #   alphanum = false
    #   global   = false
    #   abbr     = "pe"
    # }
    # elastic_cache = {
    #   name     = "elastic_cache"
    #   alphanum = false
    #   global   = false
    #   abbr     = "esca"
    # }
    # elastic_database = {
    #   name     = "redis_db"
    #   alphanum = false
    #   global   = false
    #   abbr     = "escadb"
    # }
    route_table = {
      name     = "route_table"
      alphanum = false
      global   = false
      abbr     = "rt"
    }
    secret = {
      name     = "secret"
      alphanum = false
      global   = false
      abbr     = "secret"
    }
    # sql_data_warehouse = {
    #   name     = "sql_data_warehouse"
    #   alphanum = false
    #   global   = false
    #   abbr     = "sqdw"
    # }
    # sql_database = {
    #   name     = "sql_database"
    #   alphanum = false
    #   global   = false
    #   abbr     = "sqdb"
    # }
    # sql_managed_database = {
    #   name     = "SQL Managed Database"
    #   alphanum = false
    #   global   = false
    #   abbr     = "sqmdb"
    # }
    # sql_managed_instance = {
    #   name     = "sql_managed_instance"
    #   alphanum = false
    #   global   = false
    #   abbr     = "sqmi"
    # }
    # sql_server = {
    #   name     = "sql_server"
    #   alphanum = false
    #   global   = false
    #   abbr     = "sql"
    # }
    # static_web_app = {
    #   name     = "static_web_app"
    #   alphanum = false
    #   global   = false
    #   abbr     = "stapp"
    # }
    simple_storage_service = {
      name     = "simple_storage_service"
      alphanum = false
      global   = true
      abbr     = "s3"
    }
    vpc = {
      name     = "vpc"
      alphanum = false
      global   = false
      abbr     = "vpc"
    }
    subnet = {
      name     = "subnet"
      alphanum = false
      global   = false
      abbr     = "snet"
      index_format = "%d"
    }
    # virtual_machine = {
    #   name     = "virtual_machine"
    #   alphanum = false
    #   global   = false
    #   abbr     = "ec2"
    # }
    virtual_private_network = {
      name     = "virtual_private_network"
      alphanum = false
      global   = false
      abbr     = "vpc"
      index_format  = "%d"
    }
    # vpn_gateway = {
    #   name     = "vpn_gateway"
    #   alphanum = false
    #   global   = false
    #   abbr     = "vpn"
    # }
    web_application_firewall_policy = {
      name     = "web_application_firewall_policy"
      alphanum = false
      global   = false
      abbr     = "wafp"
    }
    subnet_group = {
      name     = "subnet_group"
      alphanum = false
      global   = false
      abbr     = "sub-grp"
    }
  }

# Create equivalent "generator" map for "pseudo resource types"
  # If a resource does not have a related "pseudo resource", just use the resource itself (makes merging maps easier)
  pseudo_resources_generator = { for
    domain, resources in var.generator : domain => { for
      type, count in resources : try(keys(local.pseudo_resource_types[type])[0], type) => count
    }
  }

  # Generator configuration for resources and pseudo resources
  generator_config = { for
    domain, resources in var.generator : domain => { for
      type, count in merge(resources, local.pseudo_resources_generator[domain]) : type => {
        count     = count
        type      = type
        separator = tobool(local.all_resource_types[type].alphanum) ? "" : "-"
        name_parts = compact(flatten([
          local.prefix_parts,
          domain,
          local.all_resource_types[type].abbr
        ]))
        max_name_length = try(local.all_resource_types[type].max_name_length, -1)
        index_format    = try(local.all_resource_types[type].index_format, "%03d")
      }
    }
  }

  generated_names = { for
    domain, resources in local.generator_config : domain => { for # for each key (a.k.a. domain) in the "generator" map
      type, config in resources : type => [for                    # for each "resource_type" in the domain
        index in range(1, config.count + 1) :
        "${substr(join(config.separator, config.name_parts), 0, config.max_name_length)}${config.separator}${format(config.index_format, index)}"
    ] }
  }

  # Pseudo-resource types which names we need to derive from resource types
  pseudo_resource_types = {
    virtual_machine = {
      computer_name = {
        name            = "computer_name"
        alphanum        = true
        global          = true
        abbr            = "" # Empty abbreviation
        max_name_length = 13
        index_format    = "%02d"
      }
    }
  }

  # Resource configuration: Include resource types and "pseudo resource types"
  all_resource_types = merge(
    local.resource_types,
    local.pseudo_resource_types.virtual_machine # a.k.a. { computer_name = { name = ..., } }
  )

  # Define location_abbr_prefix 
  location              = try(local.location_map_reverse[var.location], null)
  isLocationAbbreviated = local.location != null

  location_abbr  = try(local.location_map[var.location], null)
  isLocationFull = local.location_abbr != null

  location_abbr_prefix = local.isLocationAbbreviated ? var.location : local.location_abbr

  # Define environment_abbr_prefix 
  environment              = try(local.environment_map_reverse[var.environment], null)
  isEnvironmentAbbreviated = local.environment != null

  environment_abbr  = try(local.environment_map[var.environment], null)
  isEnvironmentFull = local.environment_abbr != null

  environment_abbr_prefix = local.isEnvironmentAbbreviated ? var.environment : local.environment_abbr
  environmentSanitized    = local.isEnvironmentAbbreviated ? local.environment : var.environment # Sanitized for required_tags.Environment value

  prefix_parts = [var.organization, "${local.environment_abbr_prefix}", "${local.location_abbr_prefix}"]
  prefix       = join("-", local.prefix_parts)
}