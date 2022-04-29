+++
title = "HowTo: Write a Unit"
description = "Create and deploy your own Units"
layout = "chapter"
weight = 1
+++

# Introduction

A **Unit** represents the base element of your supervision, it describes **any**
task that must execute periodically and should succeed every time.

This means that a unit produces at least 2 kinds of data:

 - **logs:** the textual output of the task being run (ie: `curl`)
 - **state:** the final result of the task: was it successful? or did it fail?

Optionally, a unit can produce artifacts (files) thanks to Kubernetes' persistent
volumes.

# How does it work?

**Kubirds** relies on [TektonCD](https://tekton.dev) to schedule your supervision
workload:

 - for each `Unit` resource, a `Pipeline` resource is created
 - according to the `Unit`'s [schedule](/docs/concepts/unit/scheduling/), a `PipelineRun` resource is created periodically

> **NB:** For each `Reactor` resources, a task is appended to the `Pipeline` resources.
>
> For more information, see [this document](/docs/concepts/unit/pipeline/).

The `Unit` resource specify which **Docker image** to pull to run your task.
This means you can provide a *black box* to **Kubirds**, as long as it respects
the [container contract](/docs/concepts/unit/container-contract/), it will be
executed in your Kubernetes cluster.

This workflow has the following advantages:

 - your tasks will run in your cluster seamlessly, **no need** to deploy anything else
 - your supervision infrastructure scales with your cluster, with **no action** required
 - any scenario you could imagine can be integrated within Kubirds, **only** Docker images are required

# How to write a Unit?

In the next part of this tutorial, we'll see:

 - [how to write a Docker image for a Unit](/docs/dockerized-supervision/unit/image/)
 - [detailed explanation of a Unit resource](/docs/dockerized-supervision/unit/resource/)
 - [how to deploy a Unit](/docs/dockerized-supervision/unit/deploy/)
