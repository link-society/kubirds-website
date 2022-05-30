+++
title = "Kubernetes Resource"
description = "Detailed explanation of a Unit resource"
weight = 2
+++

> This tutorial explains the structure of a `Unit` resource. For more information,
> read [this document](/docs/concepts/unit/schema/).

# Resource metadata

## Versionning

The current version for `Unit` resources is `v1`. New fields may be added in the
future, but there is a guarantee that no fields will be removed.

```yaml
apiVersion: kubirds.com/v1
kind: Unit
```

If fields were to be removed, a new version `v2` would be provided.

## Naming

`Unit` resources are scoped to a Kubernetes namespace.

```yaml
metadata:
  name: mycheck
  namespace: default
```

The name of the [Tekton](https://tekton.dev) resources will be based on the
`Unit`'s name and namespaces:

 - Pipelines: `unit-$(namespace)-$(name)`
 - PipelineRuns: `unitrun-$(namespace)-$(name)`

## Labeling

Labels are used by `Reactor` and `Inhibitor` resources to select the `Unit`
resources they apply to.

Labels should provide non-specific information so `Reactor` and `Inhibitor`
resources can be re-used with many `Unit` resources.

**Bad:**

```yaml
metadata:
  # ...
  labels:
    app: myapp
    reactor-name: some-reactor
```

**Good:**

```yaml
metadata:
  # ...
  labels:
    notify-slack: "true"
    notify-sms: "true"
    output-format: "json"
```

# Resource specification

## Scheduling

The schedule is configured with a
[Recurence Rule](https://jakubroztocil.github.io/rrule/).

If **Kubirds** fails to parse a *human readable* RRule, it will try to parse it
as a standard RRule string:

```yaml
spec:
  # ...
  schedule: every week for 30 times
```

**Or:**

```yaml
spec:
  # ...
  schedule: FREQ=WEEKLY;COUNT=30;INTERVAL=1;WKST=MO
```

It should then be possible to generate `Unit` resources from a standard
[iCalender](https://datatracker.ietf.org/doc/html/rfc5545) event.

> **NB:** If your Kubernetes cluster reached its maximum number of pod, it may
> delay the scheduling of the pipeline's pods.

## Docker image configuration

The Docker image will be pulled by a Kubernetes pod. This means that the Docker
registry from where the image is pulled should be accessible to your Kubernetes
cluster.

```yaml
spec:
  # ...
  image:
    name: myapp/mycheck:1.2.3
    pullPolicy: IfNotPresent
    command: /usr/local/bin/mycheck
```

The `spec.image.pullPolicy` determines when the image will be pulled:

 - `Always`: every time a pod is scheduled, the image will be pulled
 - `IfNotPresent`: the image will be pulled only if it is not already present in the Docker host's cache
 - `Never`: the image will never be pulled and should be in the Docker host's cache

While it's technically possible, we do not recommend using `Always` as a pull policy:

 - Docker image tags are not immutable, the image may have changed between 2 pulls
 - it increases bandwith usage every time a unit is scheduled

If you want real immutability of your Docker images, we recommend you to use
digests: `image-name:tag@sha256:digest`.

> **NB:** The `spec.image.command` field is encapsulated in a script:

```bash
#!/bin/sh
set -e

COMMAND
```

This means you can write more complex scripts within the `Unit` resource:

```yaml
spec:
  # ...
  image:
    # ...
    command: |
      echo "Before"
      curl https://example.com
      echo "After"
```

Although, it is best to keep the Kubernetes resources simple and encapsulate the
command in a single script.

## Authorizations

If not specified, **Kubirds** will use the Kubernetes Service Account `default`
to run the pods.

You can configure an alternate Service Account per `Unit`:

```yaml
spec:
  # ...
  serviceAccountName: my-svc-account
```

Pull Secrets for private Docker registries must be added to the Service Account
directly.

## Archiving

By default, **Kubirds** will keep only the last `PipelineRun` resource for a
`Unit` and delete the older ones.

This behaviour can be configured per `Unit` resources:

```yaml
spec:
  # ...
  history: 10
```

> **NB:** Any number less than `1` will be ignored and the default behaviour will
> apply.

Try to keep this number reasonably low, too many resources may congest the
Kubernetes API Server.

During the test phase of the operator, we tried to disable the history. After a
few weeks, we had accumulated more than 12 000 `PipelineRun` resources. Every
time the operator tried to list the resources, the Kubernetes master node tried
to load gigabytes of data into memory and ended up crashing, making the whole
cluster unreachable.

## Configuring the environment

Each `Unit` resource can specify the environment variables to use, just like you
would do with a Kubernetes Pod:

```yaml
spec:
  # ...
  env:
    - name: FOO
      value: bar
    - name: DATABASE_URL
      valueFrom:
        secretKeyRef:
          name: my-secret
          key: DATABASE_URL
  envFrom:
    - configMapRef:
        name: my-configmap
```

Credentials should be stored inside `Secret` resources.

If the number of environment variables starts to grow, you might want to consider
storing them in a `ConfigMap` to reduce the complexity of your `Unit`.

## Mounting files

Kubernetes `ConfigMap` and `Secret` resources can also be used to mount files
inside the pod to be used by your `Unit`:

```yaml
spec:
  # ...
  volumes:
    - name: templates
      mountPath: /templates
      configMap:
        name: my-templates
    - name: secret-data
      mountPath: /secret
      secret:
        name: my-secret-files
```

The `spec.volumes[].name` property **must be unique** for all your volumes in this
`Unit`.

The `spec.volumes[].mountPath` property specifies **where** inside the container
your files will be mounted.

## Persistent data

You can use Kubernetes [Persistent Volumes](https://kubernetes.io/docs/concepts/storage/persistent-volumes/)
in order to persist data between 2 executions of your `Unit`:

```yaml
spec:
  # ...
  volumes:
    - name: workspace
      mountPath: /workspace
      hostPath: /path/on/host/node
```

# Resource status

This part is filled by the **Kubirds** operator and should not be modified by the
user.

## Admission status

When you create or modify a `Unit`, the operator will ensure that it is valid.

Errors (if any) will be specified in those fields:

```yaml
status:
  # ...
  phase: Accepted
  failureReasons: []
```

If a new resource is `Rejected`, **Kubirds** will ignore it and not schedule it.

If an existing resource becomes `Rejected` after a modification, **Kubirds** will
stop scheduling it.

**Only** `Accepted` resources will be scheduled.

## Last state

After each `Unit` execution, **Kubirds** will update those fields with the result
of the execution:

```yaml
status:
  # ...
  lastState: Succeeded
  lastStateSeen: "2022-01-01T09:00:00Z"
```

## Conditions

**Kubirds** will maintain status conditions on each `Unit`:

```yaml
status:
  conditions:
    - lastTransitionTime: "2022-01-01T09:00:00Z"
      status: "True"
      type: Completed
    - lastTransitionTime: "2022-01-01T09:00:00Z"
      status: "False"
      type: Pending
```

This can be used with the `kubectl` command to wait:

```shell
$ kubectl wait \
    --for=condition=Pending \
    --timeout=120s \
    unit/mycheck \
    -n default

$ kubectl wait \
    --for=condition=Completed \
    --timeout=120s \
    unit/mycheck \
    -n default
```