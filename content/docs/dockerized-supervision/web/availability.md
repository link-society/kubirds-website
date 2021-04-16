+++
title = "Ensure Availability"
description = "Learn to configure your monitoring tasks"
weight = 1
+++

# Use Case

{{< read-first "/docs/dockerized-supervision/web" >}}

Your web service is located at `https://api.example.com/my-service`

It exposes a route `/_health` that should return a `200 - OK` response when everything is fine.

# How To

Create the following `Unit` resource:

```yaml
---
apiVersion: kubirds.com/v1
kind: Unit
metadata:
  name: check-my-service-access
  namespace: default
  labels:
    app: my-service
spec:
  schedule: every 5 minutes
  image:
    name: curlimages/curl:latest
    command: "curl -L -v $HOST"
    pullPolicy: Always
  env:
    - name: HOST
      value: https://api.example.com/my-service/_health
```

> The `schedule` property indicates how often Kubirds should run the task.
>
> The `image` property indicates which Docker image to use to run the task.
>
> The `env` property populates the container environment.

For the complete `Unit` schema, [see this page](/docs/concepts/unit/schema).

{{< continue-reading "/docs/dockerized-supervision/web/notify" >}}
