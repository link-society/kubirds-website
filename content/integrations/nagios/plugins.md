+++
title = "Nagios Plugins"
description = "Encapsulate common Nagios plugins in a Unit"
kind = "Unit"
pricing = "FREE"
+++

# Introduction

This integration is provided as a Docker image containing the common Nagios
plugins, allowing you to run your checks directly within Kubirds.

# Usage

```yaml
---
apiVersion: kubirds.com/v1
kind: Unit
metadata:
  name: check-http
  namespace: default
spec:
  schedule: every 5 minutes
  image:
    name: linksociety/kubirds-unit-nagios-plugins:latest
    pullPolicy: Always
    command: /nagios/libexec/check_http -u $URL
  env:
    - name: URL
      value: https://google.com
```
