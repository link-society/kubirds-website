+++
title = "Reactor"
description = "Kubernetes Resource description"
weight = 3
layout = "chapter"
+++

A `Reactor` describes what should happen after the execution of a `Unit`.

Example:

```yaml
---
apiVersion: kubevisor.io/v1
kind: Reactor
metadata:
  name: notify-slack
spec:
  unitSelector:
    notify-slack: "yes"
  image:
    name: linksociety/kubevisor-reactor-slack:latest
    pullPolicy: Always
    command: notify-slack
  envFrom:
    - secretRef:
        name: my-slack-credentials
```
