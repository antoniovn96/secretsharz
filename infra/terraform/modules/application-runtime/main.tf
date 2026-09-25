locals {
  enabled       = var.enabled
  enabled_count = var.enabled ? 1 : 0
}

resource "aws_cloudwatch_log_group" "this" {
  count = local.enabled_count

  name              = "/ecs/${var.name}"
  retention_in_days = 30

  tags = {
    Name = "/ecs/${var.name}"
  }
}

resource "aws_ecs_cluster" "this" {
  count = local.enabled_count

  name = var.name

  setting {
    name  = "containerInsights"
    value = "enabled"
  }

  tags = {
    Name = var.name
  }
}

resource "aws_iam_role" "task_execution" {
  count = local.enabled_count

  name = "${var.name}-task-execution"

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

  name = "${var.name}-task-secrets"

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

resource "aws_iam_role" "task" {
  count = local.enabled_count

  name = "${var.name}-task"

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

resource "aws_security_group" "load_balancer" {
  count = local.enabled_count

  name        = "${var.name}-alb"
  description = "Public ALB security group for Secret Sharz."
  vpc_id      = var.vpc_id

  ingress {
    description = "HTTP application entry point."
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "Allow ALB to reach ECS tasks."
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group_rule" "application_from_alb" {
  count = local.enabled_count

  type                     = "ingress"
  security_group_id        = var.application_security_group_id
  source_security_group_id = aws_security_group.load_balancer[0].id
  from_port                = var.container_port
  to_port                  = var.container_port
  protocol                 = "tcp"
  description              = "ALB to ECS application tasks."
}

resource "aws_lb" "this" {
  count = local.enabled_count

  name               = substr(var.name, 0, 32)
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.load_balancer[0].id]
  subnets            = var.public_subnet_ids

  enable_deletion_protection = false

  tags = {
    Name = var.name
  }
}

resource "aws_lb_target_group" "this" {
  count = local.enabled_count

  name        = substr("${var.name}-tg", 0, 32)
  port        = var.container_port
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = var.vpc_id

  health_check {
    path                = var.health_check_path
    protocol            = "HTTP"
    matcher             = "200"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 3
  }

  tags = {
    Name = "${var.name}-target"
  }
}

resource "aws_lb_listener" "http" {
  count = local.enabled_count

  load_balancer_arn = aws_lb.this[0].arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.this[0].arn
  }
}

resource "aws_ecs_task_definition" "this" {
  count = local.enabled_count

  family                   = var.name
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = tostring(var.cpu)
  memory                   = tostring(var.memory)
  execution_role_arn       = aws_iam_role.task_execution[0].arn
  task_role_arn            = aws_iam_role.task[0].arn

  container_definitions = jsonencode([{
    name      = var.name
    image     = var.image_uri
    essential = true

    portMappings = [{
      containerPort = var.container_port
      hostPort      = var.container_port
      protocol      = "tcp"
    }]

    environment = concat([
      {
        name  = "DATABASE_SSL"
        value = "true"
      },
      {
        name  = "DATABASE_SSL_REJECT_UNAUTHORIZED"
        value = "true"
      }
    ], var.environment_variables)

    secrets = [
      for item in var.secret_environment_variables : {
        name      = item.name
        valueFrom = item.value_from
      }
    ]

    healthCheck = {
      command     = ["CMD-SHELL", "wget -q -O - http://127.0.0.1:${var.container_port}${var.health_check_path} >/dev/null || exit 1"]
      interval    = 30
      timeout     = 5
      retries     = 3
      startPeriod = 30
    }

    logConfiguration = {
      logDriver = "awslogs"
      options = {
        awslogs-group         = aws_cloudwatch_log_group.this[0].name
        awslogs-region        = data.aws_region.current.region
        awslogs-stream-prefix = "ecs"
      }
    }
  }])

  tags = {
    Name = var.name
  }
}

data "aws_region" "current" {}

resource "aws_ecs_service" "this" {
  count = local.enabled_count

  name            = var.name
  cluster         = aws_ecs_cluster.this[0].id
  task_definition = aws_ecs_task_definition.this[0].arn
  desired_count   = var.desired_count
  launch_type     = "FARGATE"

  deployment_circuit_breaker {
    enable   = true
    rollback = true
  }

  network_configuration {
    subnets          = var.private_subnet_ids
    security_groups  = [var.application_security_group_id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.this[0].arn
    container_name   = var.name
    container_port   = var.container_port
  }

  depends_on = [aws_lb_listener.http]
}

output "cluster_arn" {
  value = try(aws_ecs_cluster.this[0].arn, null)
}

output "service_name" {
  value = try(aws_ecs_service.this[0].name, null)
}

output "load_balancer_dns_name" {
  value = try(aws_lb.this[0].dns_name, null)
}

output "load_balancer_zone_id" {
  value = try(aws_lb.this[0].zone_id, null)
}
