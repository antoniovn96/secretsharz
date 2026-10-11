param(
  [string]$Profile = "",
  [string]$Region = "ap-southeast-2",
  [int]$TopCostLines = 40
)

$ErrorActionPreference = "Stop"

function Invoke-AwsJson {
  param([string[]]$Arguments, [switch]$CostExplorer)
  $argsForAws = @()
  if ($Profile) { $argsForAws += @("--profile", $Profile) }
  if (-not $CostExplorer -and -not ($Arguments -contains "--region")) {
    $argsForAws += @("--region", $Region)
  }
  $argsForAws += $Arguments
  $raw = & aws @argsForAws 2>&1
  if ($LASTEXITCODE -ne 0) {
    Write-Warning ("AWS CLI command failed: " + ($Arguments -join " "))
    Write-Warning (($raw | Out-String).Trim())
    return $null
  }
  $text = $raw | Out-String
  if ([string]::IsNullOrWhiteSpace($text)) { return $null }
  try { return $text | ConvertFrom-Json }
  catch {
    Write-Warning "AWS CLI returned output that could not be parsed as JSON."
    return $null
  }
}

function Write-Heading([string]$Title) {
  Write-Host ""
  Write-Host ("=" * 84) -ForegroundColor DarkCyan
  Write-Host $Title -ForegroundColor Cyan
  Write-Host ("=" * 84) -ForegroundColor DarkCyan
}

if (-not (Get-Command aws -ErrorAction SilentlyContinue)) {
  throw "AWS CLI was not found. Install AWS CLI v2 and configure a profile first."
}

$identity = Invoke-AwsJson -Arguments @("sts", "get-caller-identity", "--output", "json")
if (-not $identity) { throw "Could not identify the AWS account. Check your AWS CLI profile." }

Write-Heading "AWS NON-PRODUCTION COST AUDIT — READ ONLY"
Write-Host ("Account: {0}" -f $identity.Account)
Write-Host ("Caller:  {0}" -f $identity.Arn)
Write-Host ("Region:  {0}" -f $Region)
Write-Host "No resources are modified, stopped, or deleted by this script."

Write-Heading "NAT GATEWAYS"
$nats = Invoke-AwsJson -Arguments @("ec2", "describe-nat-gateways", "--filter", "Name=state,Values=available,pending", "--output", "json")
$natRows = @()
if ($nats -and $nats.NatGateways) {
  foreach ($nat in $nats.NatGateways) {
    $nameTag = ($nat.Tags | Where-Object { $_.Key -eq "Name" } | Select-Object -First 1).Value
    $addresses = @($nat.NatGatewayAddresses | ForEach-Object { $_.PublicIp } | Where-Object { $_ })
    $natRows += [pscustomobject]@{
      Name = $nameTag
      NatGatewayId = $nat.NatGatewayId
      State = $nat.State
      VpcId = $nat.VpcId
      SubnetId = $nat.SubnetId
      PublicIPs = ($addresses -join ",")
      Created = $nat.CreateTime
    }
  }
}
if ($natRows.Count) { $natRows | Format-Table -AutoSize -Wrap } else { Write-Host "No available or pending NAT gateways found." }

Write-Heading "DEFAULT ROUTES THAT POINT TO A NAT GATEWAY"
$routes = Invoke-AwsJson -Arguments @("ec2", "describe-route-tables", "--output", "json")
$routeRows = @()
if ($routes -and $routes.RouteTables) {
  foreach ($table in $routes.RouteTables) {
    foreach ($route in @($table.Routes | Where-Object { $_.DestinationCidrBlock -eq "0.0.0.0/0" -and $_.NatGatewayId })) {
      $subnets = @($table.Associations | Where-Object { $_.SubnetId } | ForEach-Object { $_.SubnetId })
      $routeRows += [pscustomobject]@{
        RouteTableId = $table.RouteTableId
        VpcId = $table.VpcId
        Subnets = ($subnets -join ",")
        NatGatewayId = $route.NatGatewayId
        State = $route.State
      }
    }
  }
}
if ($routeRows.Count) { $routeRows | Format-Table -AutoSize -Wrap } else { Write-Host "No default routes to NAT gateways found." }

Write-Heading "VPC ENDPOINTS (INTERFACE ENDPOINTS CAN HAVE HOURLY CHARGES)"
$endpoints = Invoke-AwsJson -Arguments @("ec2", "describe-vpc-endpoints", "--output", "json")
$endpointRows = @()
if ($endpoints -and $endpoints.VpcEndpoints) {
  foreach ($endpoint in $endpoints.VpcEndpoints) {
    $nameTag = ($endpoint.Tags | Where-Object { $_.Key -eq "Name" } | Select-Object -First 1).Value
    $endpointRows += [pscustomobject]@{
      Name = $nameTag
      EndpointId = $endpoint.VpcEndpointId
      Type = $endpoint.VpcEndpointType
      Service = $endpoint.ServiceName
      State = $endpoint.State
      VpcId = $endpoint.VpcId
    }
  }
}
if ($endpointRows.Count) { $endpointRows | Format-Table -AutoSize -Wrap } else { Write-Host "No VPC endpoints found." }

Write-Heading "ECS SERVICES AND NETWORK CONFIGURATION"
$clusters = Invoke-AwsJson -Arguments @("ecs", "list-clusters", "--output", "json")
$ecsRows = @()
if ($clusters -and $clusters.clusterArns) {
  foreach ($clusterArn in $clusters.clusterArns) {
    $services = Invoke-AwsJson -Arguments @("ecs", "list-services", "--cluster", $clusterArn, "--output", "json")
    if (-not $services -or -not $services.serviceArns -or $services.serviceArns.Count -eq 0) { continue }
    # Describe each service separately to keep argument handling compatible across PowerShell versions.
    foreach ($serviceArn in $services.serviceArns) {
      $one = Invoke-AwsJson -Arguments @("ecs", "describe-services", "--cluster", $clusterArn, "--services", $serviceArn, "--output", "json")
      foreach ($svc in @($one.services)) {
        $net = $svc.networkConfiguration.awsvpcConfiguration
        $ecsRows += [pscustomobject]@{
          Cluster = ($clusterArn -split "/")[-1]
          Service = $svc.serviceName
          Desired = $svc.desiredCount
          Running = $svc.runningCount
          Status = $svc.status
          LaunchType = $svc.launchType
          TaskDefinition = ($svc.taskDefinition -split "/")[-1]
          Subnets = ($net.subnets -join ",")
          AssignPublicIp = $net.assignPublicIp
          SecurityGroups = ($net.securityGroups -join ",")
        }
      }
    }
  }
}
if ($ecsRows.Count) { $ecsRows | Format-Table -AutoSize -Wrap } else { Write-Host "No ECS services returned, or the role lacks ECS read permissions." }

Write-Heading "APPLICATION LOAD BALANCERS"
$lbs = Invoke-AwsJson -Arguments @("elbv2", "describe-load-balancers", "--output", "json")
$lbRows = @()
if ($lbs -and $lbs.LoadBalancers) {
  foreach ($lb in $lbs.LoadBalancers) {
    $lbRows += [pscustomobject]@{
      Name = $lb.LoadBalancerName
      Type = $lb.Type
      Scheme = $lb.Scheme
      State = $lb.State.Code
      VpcId = $lb.VpcId
      DNSName = $lb.DNSName
    }
  }
}
if ($lbRows.Count) { $lbRows | Format-Table -AutoSize -Wrap } else { Write-Host "No load balancers found." }

Write-Heading "RDS DATABASE INSTANCES"
$dbs = Invoke-AwsJson -Arguments @("rds", "describe-db-instances", "--output", "json")
$dbRows = @()
if ($dbs -and $dbs.DBInstances) {
  foreach ($db in $dbs.DBInstances) {
    $dbRows += [pscustomobject]@{
      Identifier = $db.DBInstanceIdentifier
      Engine = $db.Engine
      Class = $db.DBInstanceClass
      Status = $db.DBInstanceStatus
      StorageGB = $db.AllocatedStorage
      MultiAZ = $db.MultiAZ
      PubliclyAccessible = $db.PubliclyAccessible
      VpcId = $db.DBSubnetGroup.VpcId
    }
  }
}
if ($dbRows.Count) { $dbRows | Format-Table -AutoSize -Wrap } else { Write-Host "No RDS instances found." }

Write-Heading "COST EXPLORER — MONTH TO DATE, GROUPED BY SERVICE + USAGE TYPE"
$today = Get-Date
$start = (Get-Date -Year $today.Year -Month $today.Month -Day 1).ToString("yyyy-MM-dd")
$end = $today.AddDays(1).ToString("yyyy-MM-dd")
Write-Host ("Period: {0} to {1} (end date is exclusive)" -f $start, $end)
$costs = Invoke-AwsJson -CostExplorer -Arguments @(
  "ce", "get-cost-and-usage",
  "--time-period", "Start=$start,End=$end",
  "--granularity", "MONTHLY",
  "--metrics", "UnblendedCost",
  "--group-by", "Type=DIMENSION,Key=SERVICE", "Type=DIMENSION,Key=USAGE_TYPE",
  "--region", "us-east-1",
  "--output", "json"
)
if ($costs -and $costs.ResultsByTime) {
  $costRows = @()
  foreach ($period in $costs.ResultsByTime) {
    foreach ($group in $period.Groups) {
      $amount = [double]$group.Metrics.UnblendedCost.Amount
      if ($amount -gt 0) {
        $costRows += [pscustomobject]@{
          Service = $group.Keys[0]
          UsageType = $group.Keys[1]
          CostUSD = [math]::Round($amount, 3)
        }
      }
    }
  }
  $costRows | Sort-Object CostUSD -Descending | Select-Object -First $TopCostLines | Format-Table -AutoSize -Wrap
} else {
  Write-Host "Cost Explorer data could not be retrieved. Check Cost Explorer permissions and activation."
}

Write-Heading "NEXT STEP"
Write-Host "Share this output for review before deleting a NAT gateway or changing subnet routes."
Write-Host "In particular, investigate NAT bytes processed before moving workloads: 464 GB is high for a small application stack."
Write-Host "This audit is read-only; it does not change resources."
