locals {
  enabled       = var.enabled
  enabled_count = var.enabled ? 1 : 0
}

data "aws_region" "current" {}

resource "aws_cloudwatch_log_group" "this" {
  count = local.enabled_count

  name              = "/ecs/${var.name}"
  retention_in_days = var.log_retention_in_days

  tags = {
    Name = "/ecs/${var.name}"
  }
}

resource "aws_ecs_cluster" "this" {
  count = local.enabled_count

  name = var.name

  tags = {
    Name = var.name
  }
}

resource "aws_iam_role" "task_execution" {
  count = local.enabled_count

  name = "${var.name}-execution"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = {
        Service = "ecs-tasks.amazonaws.com"
      }
      Action = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_role_policy_attachment" "task_execution_base" {
  count = local.enabled_count

  role       = aws_iam_role.task_execution[0].name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_policy" "task_execution_secrets" {
  count = local.enabled && length(var.secret_arns) > 0 ? 1 : 0

  name = "${var.name}-secrets"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect   = "Allow"
      Action   = ["secretsmanager:GetSecretValue"]
      Resource = var.secret_arns
    }]
  })
}

resource "aws_iam_role_policy_attachment" "task_execution_secrets" {
  count = local.enabled && length(var.secret_arns) > 0 ? 1 : 0

  role       = aws_iam_role.task_execution[0].name
  policy_arn = aws_iam_policy.task_execution_secrets[0].arn
}

resource "aws_ecs_task_definition" "this" {
  count = local.enabled_count

  family                   = var.name
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = tostring(var.cpu)
  memory                   = tostring(var.memory)
  execution_role_arn       = aws_iam_role.task_execution[0].arn

  container_definitions = jsonencode([{
    name        = var.name
    image       = var.image_uri
    essential   = true
    command     = var.command
    environment = []

    secrets = [
      for item in var.secret_environment_variables : {
        name      = item.name
        valueFrom = item.value_from
      }
    ]

    logConfiguration = {
      logDriver = "awslogs"
      options = {
        awslogs-group         = aws_cloudwatch_log_group.this[0].name
        awslogs-region        = data.aws_region.current.region
        awslogs-stream-prefix = "migration"
      }
    }
  }])

  tags = {
    Name = var.name
  }
}

output "cluster_name" {
  value = try(aws_ecs_cluster.this[0].name, null)
}

output "cluster_arn" {
  value = try(aws_ecs_cluster.this[0].arn, null)
}

output "task_definition_arn" {
  value = try(aws_ecs_task_definition.this[0].arn, null)
}
