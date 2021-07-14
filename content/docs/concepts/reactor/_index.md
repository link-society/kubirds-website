+++
title = "Reactor"
description = "Status checking reactor"
weight = 3
layout = "chapter"
+++

A `Reactor` describes what should happen after the execution of a `Unit`.

Example:

```yaml
---
apiVersion: kubirds.com/v1
kind: Reactor
metadata:
  name: notify-slack
spec:
  unitSelector:
    notify-slack: "yes"
  image:
    name: ghcr.io/link-society/kubirds-reactor-slack:latest
    pullPolicy: Always
    command: notify-slack
  envFrom:
    - secretRef:
        name: my-slack-credentials
```
