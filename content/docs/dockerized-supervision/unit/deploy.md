+++
title = "Deployment"
description = "How to deploy a Unit"
weight = 3
+++

If your `Unit` has a great number of parameters and/or depends on other resources
like a `ConfigMap` or a `Secret`, you might want to create an [Helm](https://helm.sh)
chart to deploy your `Unit`.

In this tutorial, we'll see how to create an *Helm* chart for a cURL Unit.

**Example of `values.yaml`:**

```yaml
---

# User Configuration

schedule: every 5 minutes
history: 1
serviceAccountName: default

host:
  value: http://example.com

labels: {}

# Internal Configuration (can be overidden)

image:
  name: curlimages/curl:latest
  pullPolicy: IfNotPresent

args: '-v'
```

**`unit.yaml` template:**

```yaml
---
apiVersion: kubirds.com/v1
kind: Unit
metadata:
  name: {{ include "kubirds-curl-unit.fullname" . }}
  labels:
    {{- include "kubirds-curl-unit.labels" . | nindent 4 }}
    {{ if .Values.labels }}
    {{ .Values.labels | toYaml | nindent 4 }}
    {{ end}}
spec:
  schedule: {{ .Values.schedule }}
  history: {{ .Values.history }}
  serviceAccountName: {{ .Values.serviceAccountName }}
  image:
    name: {{ .Values.image.name }}
    pullPolicy: {{ .Values.image.pullPolicy }}
    command: "curl -L {{ .Values.args }} $HOST"
  env:
    - name: HOST
      {{ .Values.host | toYaml | nindent 6 }}
```