+++
title = "Getting Started"
icon = "icon-mdi_extension"
+++

# Introduction

Kubevisor brings easy supervision to your infrastructure. It provides a simple way to declare how it should be monitored and takes care of the rest with Kubernetes.

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

In order to setup Kubevisor, you will need the following:

 - a Kubernetes cluster (GKE, AKS, EKS, Minikube, KinD, ...)
 - [Tekton](https://tekton.dev) installed in the cluster
 - a [RabbitMQ](https://rabbitmq.com) message broker
 - [git](https://git-scm.com) to fetch the sources
 - [helm](https://helm.sh) to install the components

## Get the source code

Access to Kubevisor's source code is done through [Github Deploy keys](https://docs.github.com/en/free-pro-team@latest/developers/overview/managing-deploy-keys#deploy-keys).

Once the deploy key has been added to our repositories, you can clone them:

```
$ git clone git@github.com:link-society/kubevisor.git
$ git clone git@github.com:link-society/kubevisor-dashboard.git
```

## Install Helm charts

First, install the operator:

```
$ helm upgrade --install kubevisor-operator ./kubevisor/chart -f values.operator.yaml --wait
```

Example of `values.operator.yaml`:

```yaml
---
replicaCount: 3

image:
  name: linksociety/kubevisor-operator
  tag: latest
  pullPolicy: Always

serviceAccountName: default

rabbitUrl:
  value: amqp://guest:guest@localhost:5672/
```

Then, install the dashboard:

```
$ helm upgrade --install kubevisor-dashboard ./kubevisor-dashboard/chart -f values.dashboard.yaml --wait
```

Example of `values.dashboard.yaml`:

```yaml
---
frontend:
  replicaCount: 3
  image:
    name: linksociety/kubevisor-dashboard-frontend
    tag: latest
    pullPolicy: Always
```

# Use Kubevisor

In order to start to use Kubevisor, you can continue with the [docker tutorial](/content/docs/howto-docker-supervision/tutorial.md) for web oriented use or more advanced use with the [dashboard tutorial](/content/docs/dashboard/tutorial.md).