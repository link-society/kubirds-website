+++
title = "Unit"
description = "Kubernetes resource description"
weight = 1
layout = "chapter"
+++

A `Unit` is the base component of your supervision. It describes a task that
should be executed periodically.

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
    command: "-L -v $HOST"
    pullPolicy: Always
  env:
    - name: HOST
      value: https://google.com
  schedule: every 5 minutes
```
