+++
title = "Plan"
description = "Learn how to stop monitoring during certain time periods"
weight = 3
+++

# Use Case

{{< read-first "/docs/dockerized-supervision/web/notify" >}}

You planned an upgrade every weekend when there is no activity on your web service.

There is a service interruption during the upgrade, to apply database migrations.

You don't want to be notified by your monitoring that your service is down during the upgrade.

# How To

Create the following Kubernetes resource:

```yaml
---
apiVersion: kubevisor.io/v1
kind: Inhibitor
metadata:
  name: weekly-upgrade
  namespace: default
spec:
  startDate: "2020-09-19T00:00:00.000Z"
  duration: 1 hour
  schedule: every week
  unitSelector:
    app: my-service
```

> The `startDate` property is mandatory to set a starting point for the schedule.
>
> The `duration` property indicates how long units should be silenced.
>
> The `schedule` property indicates when units should be silenced.
>
> The `unitSelector` property selects (by label) which units should be silenced.

For the complete `Inhibitor` schema, [see this page](/docs/concepts/inhibitor/schema).

{{< continue-reading "/docs/dockerized-supervision/web/reuse" >}}
