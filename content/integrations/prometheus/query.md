+++
title = "Query"
description = "Query data from the Prometheus HTTP API"
kind = "Unit"
pricing = "FREE"
+++

# Introduction

Using [cURL](https://curl.se/), it becomes easy to query the
[Prometheus API](https://prometheus.io/docs/prometheus/latest/querying/api/) in
order to implement complex alerting.

# Usage

```yaml

---
apiVersion: kubirds.com/v1
kind: Unit
metadata:
  name: prometheus-query
  namespace: default
spec:
  schedule: every 5 minutes
  image:
    name: badouralix/curl-jq:latest
    pullPolicy: Always
    command: |
      status=`curl $PROMETHEUS_HOST/api/v1/query?query=$QUERY 2>/dev/null | jq -r .status`
      case $status in
        success)
          echo "API request done successfuly"
          exit 0
          ;;

        *)
          echo "API request failed"
          exit 1
          ;;
      esac
  env:
    - name: PROMETHEUS_HOST
      valueFrom:
        secretKeyRef:
          name: prometheus-host
          key: URL
    - name: QUERY
      value: up
```
