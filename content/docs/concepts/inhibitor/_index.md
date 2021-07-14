+++
title = "Inhibitor"
description = "Status checking inhibitor"
weight = 4
layout = "chapter"
+++

An `Inhibitor` describes when the execution of a `Unit` should be skipped.

Example:

```yaml
---
apiVersion: kubirds.com/v1
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
