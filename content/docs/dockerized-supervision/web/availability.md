+++
title = "Ensure Availability"
description = "Learn to configure your monitoring tasks"
weight = 1
+++

# Use Case

You want to check every 5 minutes if your web service located at `https://api.example.com/my-service` is up (return `200 - OK`).

# How To

Create the following `Unit` resource for checking with curl, every 5 minutes, if your web service is reachable or not:

```yaml
---
apiVersion: kubevisor.io/v1
kind: Unit
metadata:
  name: check-my-service-access
  namespace: default
  labels:
    app: my-service
    notify-slack: "yes"
spec:
  schedule: every 5 minutes
  image:
    name: curlimages/curl:latest
    command: "curl -L -v $HOST"
    pullPolicy: Always
  env:
    - name: HOST
      value: https://api.example.com/my-service
```

> The `schedule` property indicates how often Kubevisor should run the task.
>
> The `image` property indicates which Docker image to use to run the task.
>
> The `env` property populates the container environment.

For the complete `Unit` schema, [see this page](/docs/concepts/unit/schema).

Continue to the [next step](/docs/dockerized-supervision/web/notify) for notifying check status update on slack.
