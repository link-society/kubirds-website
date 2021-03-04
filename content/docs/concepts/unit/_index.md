+++
title = "Unit"
description = "Kubernetes resource description"
weight = 2
layout = "chapter"
+++

A `Unit` is the base component of your supervision. It describes a task that
must execute periodically and should succeed every time.

Example:

```yaml
---
apiVersion: kubevisor.io/v1
kind: Unit
metadata:
  name: check-google-access
  labels:
    notify-slack: "yes"
    active-during-weekend: "no"
spec:
  image:
    name: curlimages/curl:latest
    command: "curl -L -v $HOST"
    pullPolicy: Always
  env:
    - name: HOST
      value: https://google.com
  schedule: every 5 minutes
```
