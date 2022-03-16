+++
title = "Prometheus Pusher"
description = "Push metrics to Prometheus PushGateway"
kind = "Reactor"
pricing = "FREE"
+++

# Introduction

Export metrics to Prometheus via [PushGateway](https://github.com/prometheus/pushgateway).

It assumes that the format of the Unit's output respects the Prometheus Exporter format.

# Usage

```yaml
---
apiVersion: kubirds.com/v1
kind: Reactor
metadata:
  name: prometheus-pusher
  namespace: default
spec:
  unitSelector:
    unit-output-format: prometheus
  image:
    name: linksociety/kubirds-reactor-prometheus-pusher:latest
    pullPolicy: Always
    command: prometheus-pusher
  env:
    - name: PROMETHEUS_PUSHGATEWAY
      valueFrom:
        secretKeyRef:
          name: prometheus-pushgateway
          key: URL
```
