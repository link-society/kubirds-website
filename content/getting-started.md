+++
title = "Getting Started"
icon = "icon-mdi_extension"
+++

# Introduction

Kubirds brings easy supervision to your infrastructure. It provides a simple way
to declare how it should be monitored and takes care of the rest with Kubernetes.

The whole operator revolves around 3 concepts:

## Units

The base element of your supervision. A `Unit` describes a task that must
execute periodically and should succeed every time.

For more information, consult the [documentation](/docs/concepts/unit).

## Reactors

This is where the logic happens. A `Reactor` describes what should happen
after the execution of a `Unit`.

The execution of a `Reactor` can be triggered by the following events:

 - **success:** the `Unit` execution was successful
 - **failure:** the `Unit` execution failed
 - **fixed:** the `Unit` execution was successful while the previous one failed
 - **regression:** the `Unit` execution failed while the previous one was successful

For more information, consult the [documentation](/docs/concepts/reactor).

## Inhibitors

An `Inhibitor` describes when the execution of a `Unit` should be skipped, ie:

 - during a migration
 - during a backup restore
 - outside work hours

For more information, consult the [documentation](/docs/concepts/inhibitor).

# Setting up

## Prerequisites

In order to setup Kubirds, you will need the following:

 - a Kubernetes cluster (GKE, AKS, EKS, Minikube, KinD, ...)
 - [Tekton](https://tekton.dev) installed in the cluster
 - a [RabbitMQ](https://rabbitmq.com) message broker
 - [helm](https://helm.sh) to install the components


## Install Helm charts

You'll need the [Link Society](https://charts.link-society.com) Helm repository:

```
$ helm repo add link-society https://charts.link-society.com/stable
$ helm repo update
```

Then, install the operator:

```
$ helm upgrade --install kubirds link-society/kubirds -f values.yaml --wait
```

Example of `values.operator.yaml`:

```yaml
---
container:
  registry: ghcr.io

controller:
  enabled: yes

  replicas: 3
  image:
    name: link-society/kubirds-controller
    tag: latest
    pullPolicy: Always

  statusImage:
    name: lachlanevenson/k8s-kubectl
    tag: latest
    pullPolicy: IfNotPresent

  serviceAccountName: default

  rabbitUrl:
    value: amqp://guest:guest@localhost:5672/

admission-webhook:
  enabled: yes

  replicas: 3
  image:
    name: link-society/kubirds-admission-webhook
    tag: latest
    pullPolicy: Always

dashboard:
  enabled: yes

  replicas: 3
  image:
    name: link-society/kubirds-dashboard
    tag: latest
    pullPolicy: Always

ingress:
  enabled: yes

  host: status.link-society.com

  annotations:
    cert-manager.io/cluster-issuer: letsencrypt

nameOverride: ""
fullnameOverride: ""
```

# What's next ?

We recommend you reading:

 - the [Dashboard Manual](/docs/dashboard/) if you want to visualize your infrastructure's health
 - the [Dockerized Supervision Guide](/docs/dockerized-supervision) if you want to configure your monitoring
 - the [Architecture Specification](/docs/concepts/) if you want to know more about how Kubirds is built
