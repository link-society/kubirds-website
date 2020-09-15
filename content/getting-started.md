+++
title = "Getting Started"
icon = "icon-mdi_extension"
weight = 10
+++

## Introduction

Kubevisor brings easy supervision to your Kubernetes cluster.
It provides a simple way to declare how your infrastructure should be monitored
and takes care of the rest.

The whole operator revolves around concepts:

 - checks (performed by a **probe**)
 - notifiers
 - downtimes

## Resources

Each concept is represented by a custom Kubernetes resource.

A `Check` resource defines how and when the healthcheck must be performed:

```yaml
---
apiVersion: kubevisor.io/v1
kind: Check
metadata:
  name: check-google-access
  labels:
    notify-slack: "yes"
    active-during-weekend: "no"
spec:
  image:
    name: linksociety/kubevisor-probe-curl:latest
    pullPolicy: Always
  env:
    - name: HOST
      value: https://google.com
  schedule: every 5 minutes
```

As soon as the check is created, it will be scheduled for execution and each
execution will updates its status:

```yaml
status:
  last_state: 0
  last_state_seen: "2020-09-15T20:38:54.663Z"
```

A `Notifier` resource defines what checks it applies to, and how it must be
performed:

```yaml
---
apiVersion: kubevisor.io/v1
kind: Notifier
metadata:
  name: notify-slack
spec:
  image:
    name: linksociety/kubevisor-notifier-slack:latest
    pullPolicy: Always
  envFrom:
    secretRef:
      name: my-slack-credentials
  selector:
    matchLabels:
      notify-slack: "yes"
```

Finally, a `Downtime` resource defines a period of expected failure and will
skip the execution of the checks it applies to during that time:

```yaml
---
apiVersion: kubevisor.io/v1
kind: Downtime
metadata:
  name: weekend-shutdown
spec:
  startDate: "2020-09-19T00:00:00.000Z"
  duration: 2 days
  schedule: every week
  selector:
    matchLabels:
      active-during-weekend: "no"
```

## Probes and notifiers as containers

The containers used by the `Check` and `Notifier` resources must follow some
rules, for more information consult the [documentation](/docs/container-contract/).
