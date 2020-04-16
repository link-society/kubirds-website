+++
title = "Getting Started"
description = "Quick introduction to Kubevisor"
date = 2020-01-04T20:17:00+01:00
weight = 10
draft = false
bref = "Quick introduction to Kubevisor"
toc = true
+++

### Introduction

Kubevisor brings easy supervision to your Kubernetes cluster.
It provides a simple way to declare how your infrastructure should be monitored
and takes care of the rest.

### Probes

A probe is a simple Docker container performing a healthcheck.

See it in action:

```
---
apiVersion: kubevisor.io/v1
kind: Check
metadata:
  name: probe-google-access
  labels:
    notify-slack: "yes"
spec:
  image:
    name: linksociety/kubevisor-probe-curl:latest
    pullPolicy: Always
  env:
    - name: HOST
      value: https://google.com
  schedule: every 5 minutes
```

### Notifiers

Just like a probe, a notifier is a simple Docker container performing the
notification to an external service.

See it in action:

```
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
