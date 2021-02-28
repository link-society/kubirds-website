+++
title = "Notify Slack"
description = "Learn to setup your notifications"
weight = 2
+++

# Use Case

{{< read-first "/docs/dockerized-supervision/web/availability" >}}

You have configured a Slack Webhook to receive notifications from your monitoring.

# How To

Create a secret containing the URL of your webhook:

```yaml
---
apiVersion: v1
kind: Secret
metadata:
  name: my-slack-webhook
  namespace: default
stringData:
  URL: "<your slack webhook URL>"
```

Then create the following `Reactor` resource:

```yaml
---
apiVersion: kubevisor.io/v1
kind: Reactor
metadata:
  name: slack-notifier
  namespace: default
spec:
  unitSelector:
    app: my-service
  triggers:
    successful: no
    failed: no
    fixed: yes
    regression: yes
  image:
    name: curlimages/curl:latest
    pullPolicy: Always
    command: >
      curl -X POST $HOST -H "Content-Type: application/json" \
           -d "{ \"text\": \"state: $UNIT_STATE\" }"
  env:
    - name: HOST
      valueFrom:
        secretKeyRef:
          name: my-slack-webhook
          key: URL
```

> The `unitSelector` property selects the units (by label) that need to trigger this reactor.
>
> The `triggers` property controls when the reactor will be executed.
>
> The `image` and `env` properties serves the same purpose as for the Unit resource.
>
> The container environment is automatically populated with the variable `UNIT_STATE` (the Unit's last exit code).

For the complete `Reactor` schema, [see this page](/docs/concepts/reactor/schema).

{{< continue-reading "/docs/dockerized-supervision/web/plan" >}}
