+++
title = "Data Access"
description = "Best practices with persistent volumes"
weight = 2
+++

# Introduction

In the previous example, we created a strong coupling between the unit and its reactor.

Because they reference the same persistent volume, the reactor cannot be used with another unit.

Reactors should access the persistent volume in `ReadOnly` access mode, while units should access it
in `ReadWriteOnce` access mode (preventing parallel writes).

# Use Case

You have a unit `predict` performing predictions based on a ML model.

The model is huge and cannot be reasonnably stored in the Docker image.

You have a Docker image `example/fetch-model:latest` whose job is to download the model.

# How To

First, create the persistent volume for your model:

```yaml
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: my-ml-model-pvc
  namespace: default
spec:
  storageClassName: default
  accessModes:
    - ReadWriteOnce
    - ReadOnly
  resources:
    requests:
      storage: 30Gi
```

Then create a task to provision your volume:

```yaml
---
apiVersion: tekton.dev/v1alpha1
kind: TaskRun
metadata:
  generateName: provision-my-ml-model-
  namespace: default
spec:
  taskSpec:
    steps:
      - name: main
        image: example/fetch-model:latest
        command: 'fetch-model -o /tmp/model.bin'
        volumeMounts:
          - name: model-pvc
            mountPath: /tmp
    volumes:
      - name: model-pvc
        persistentVolumeClaim:
          claimName: my-model-pvc
```

Finally, create your unit:

```yaml
---
apiVersion: kubevisor.io/v1
kind: Unit
metadata:
  name: predict
  namespace: default
spec:
  # ...
  volumes:
    - name: model-pvc
      mountPath: /tmp
      persistentVolumeClaim:
        claimName: my-model-pvc
        readOnly: yes
```
