+++
title = "Docker Image"
description = "How to write a Docker image for a Unit"
weight = 1
+++

# About the container contract

Because the Docker image will be used as a task with a [Tekton](https://tekton.dev)
`Pipeline` resource to run the `Unit`'s command, there are certain expectations
that must be fulfilled for the image to work properly:

 - **Tekton** overwrites the `ENTRYPOINT` to control the order of execution within the pipeline
 - **Kubirds** overwrites the `CMD` to capture logs and the exit code

> For more information, read [this document](/docs/concepts/unit/container-contract/).

# Best practices

Your Docker image should provide a single executable that can be used in the
`spec.image.command` field of the `Unit` resource.

Passing options via the command line is fine, but we recommand using environment
variables to allow the `Unit` to fetch configuration from a `ConfigMap` or a
`Secret`.

From a security point of view:

 - avoid running as `root`
 - do not expose ports
 - avoid using `latest` tags

# Example of Dockerfile

The following `Dockerfile` is based on `alpine/k8s` which provides the following
commands:

 - `helm`
 - `kubectl`
 - `kustomize`
 - `jq`
 - `kubeseal`

> For more information, consult [their repository](https://github.com/alpine-docker/k8s).

```dockerfile
FROM alpine/k8s:1.22.6

ARG USR=default
ENV HOME /home/$USER

RUN adduser -D $USER

USER $USER
WORKDIR $HOME
```

Since the base image already provides everything, the only modification we add is
a new user to not run the container as `root`.

> **NB:** The base image can already be used as-is by **Kubirds**, but from a
> security point of view, not running as `root` could be a requirement in most
> organizations.
