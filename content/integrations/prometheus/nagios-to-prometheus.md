+++
title = "Nagios to Prometheus"
description = "Push Nagios plugin perfdata to Prometheus PushGateway"
kind = "Reactor"
pricing = "FREE"
+++

# Introduction

Using this integration, export the performance data produced by your
[Nagios Plugins](https://nagios-plugins.org/doc/guidelines.html) to a
[Prometheus PushGateway](https://github.com/prometheus/pushgateway).

{{< figure "/img/schemas/monitoring.svg" "Nagios to Prometheus schema" >}}

# Usage

This integration is provided as a Docker image that can be used in a Reactor.

## Environment

| Variable | Default | Description |
| --- | --- | --- |
| `PROMETHEUS_PUSHGATEWAY` | `http://pushgateway.example.com:9091/metrics/job/myjob` | URL to Prometheus PushGateway |

## Example of Reactor

```yaml
---
apiVersion: kubirds.com/v1
kind: Reactor
metadata:
  name: nagios-to-prometheus
  namespace: default
spec:
  unitSelector:
    unit-output-format: nagios
  image:
    name: linksociety/kubirds-reactor-nagios-to-prometheus:latest
    pullPolicy: Always
    command: nagios-to-prometheus
  env:
    - name: PROMETHEUS_PUSHGATEWAY
      valueFrom:
        secretKeyRef:
          name: prometheus-pushgateway
          key: URL
```
