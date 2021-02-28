+++
title = "Persistent Volume"
description = "Share data between your units and reactors"
weight = 1
+++

# Use Case

{{< read-first "/docs/dockerized-supervision/data" >}}

You have a Docker image `example/test-suite:latest` providing a command `run-test-suite`.

The command produce a [JUnit](https://junit.org/junit5/) report to `/tmp/report.xml`.

You have a webhook accepting *JUnit* reports for further business logic.

# How-To

First, create a persistent volume to store your report:

```yaml
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: my-testsuite-workspace-pvc
  namespace: default
spec:
  storageClassName: default
  accessModes:
    - ReadWriteOnce
    - ReadOnly
  resources:
    requests:
      storage: 10Mi
```

Then mount the volume on your unit:

```yaml
---
apiVersion: kubevisor.io/v1
kind: Unit
metadata:
  name: my-testsuite
  namespace: default
  labels:
    publish-junit-report: "yes"
spec:
  schedule: "every day"
  image:
    name: example/test-suite:latest
    command: "run-test-suite -o /tmp/report.xml"
    pullPolicy: Always
  volumes:
    - name: workspace
      mountPath: /tmp
      persistentVolumeClaim:
        claimName: my-testsuite-workspace-pvc
```

And finally, mount the volume on your reactor:

```yaml
---
apiVersion: kubevisor.io/v1
kind: Reactor
metadata:
  name: junit-publisher
  namespace: default
spec:
  unitSelector:
    publish-junit-report: "yes"
  image:
    name: curlimages/curl:latest
    command: "curl -X POST -d @/tmp/report.xml $HOST"
    pullPolicy: Always
  env:
    - name: HOST
      value: https://api.example.com/junit-report/
  volumes:
    - name: workspace
      mountPath: /tmp
      persistentVolumeClaim:
        claimName: my-testsuite-workspace-pvc
        readOnly: yes
```

**NB:** In this example, we used a `PersistentVolumeClaim` but any volume that could be used for a `Pod` can be used here.

{{< continue-reading "/docs/dockerized-supervision/data/access" >}}
