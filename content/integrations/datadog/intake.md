+++
title = "Datadog Intake"
description = "Send unit outputs to Datadog"
kind = "Reactor"
pricing = "FREE"
+++

# Introduction

This integration is provided as a Docker image used to transmit the Unit's
output to [Datadog](https://datadoghq.com/).

By default, it assumes the logs are `text/plain` but this can be easily
configured through environment variables.

For more informations about Datadog, please consult
[their documentation](https://docs.datadoghq.com/fr/api/latest/logs/#send-logs).

# Usage

## Environment

| Variable | Default | Description |
| --- | --- | --- |
| `DATADOG_ENDPOINT` | `https://http-intake.logs.datadoghq.com/api/v2/logs` | URL to Datadog API |
| `DATADOG_CONTENT_TYPE` | `text/plain` | Type of logs to send |
| `DATADOG_API_KEY` | N/A | Your Datadog API_KEY. **REQUIRED** |

## Example of Reactor

```yaml
---
apiVersion: kubirds.com/v1
kind: Reactor
metadata:
  name: datadog-send
  namespace: default
spec:
  unitSelector:
    unit-output-format: raw
  image:
    name: linksociety/kubirds-reactor-datadog-intake:latest
    pullPolicy: Always
    command: datadog-send
  env:
    - name: DATADOG_API_KEY
      valueFrom:
        secretKeyRef:
          name: datadog-api-key
          key: API_KEY
```
