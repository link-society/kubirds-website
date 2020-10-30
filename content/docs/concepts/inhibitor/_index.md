+++
title = "Inhibitor"
description = "Kubernetes resource description"
weight = 3
layout = "chapter"
+++

An `Inhibitor` resource defines a regular period of time when units
execution must be skipped:

```yaml
---
apiVersion: kubevisor.io/v1
kind: Inhibitor
metadata:
  name: weekend-shutdown
spec:
  startDate: "2020-09-19T00:00:00.000Z"
  duration: 2 days
  schedule: every week
  unitSelector:
    active-during-weekend: "no"
```
