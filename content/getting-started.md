+++
title = "Getting Started"
layout = "getting-started"
markup = "mmark"

toc = true

[metadata]
description = "Getting started guide of the first Cloud-Native supervision engine for Kubernetes dedicated to Alerting, Monitoring and many more."

[description_banner]

text = """
Kubirds brings easy supervision to your Kubernetes cluster. It allows you to
encapsulate any business logic to monitor and supervise your infrastructure,
Kubirds will take care of the rest.
"""

call_to_action = { url = "/offers/", label = "Discover our offers &rarr;" }

[key_points]

items_per_row = 4
column_size = "is-one-quarter"

[[key_points.item]]

icon = "fas fa-robot"
title = "Automated"
description = """
Avoid manual tasks with **Kubirds**
"""

[[key_points.item]]

icon = "fas fa-puzzle-piece"
title = "Interoperable"
description = """
Query and Mutate any system
"""

[[key_points.item]]

icon = "fas fa-file-alt"
title = "Declarative"
description = """
Describe your supervision and let it run
"""

[[key_points.item]]

icon = "fas fa-expand-arrows-alt"
title = "Scalable"
description = """
Thanks to [Kubernetes](https://kubernetes.io), your workload is as scalable as
your infrastructure.
"""

[schema]

domain = "⚙️ Generic usage"
caption = "Use generic concepts to represent your supervision"
url = "/img/schemas/generic.svg"

[concepts]

unit = """
The base element of your supervision. A `Unit` describes a task that must
execute periodically and should succeed every time.
"""

reactor = """
This is where the logic happens. A `Reactor` describes what should happen after
the execution of a Unit.

The execution of a `Reactor` can be triggered by the following events:

 - **success:** the `Unit` execution was successful
 - **failure:** the `Unit` execution failed
 - **fixed:** the `Unit` execution was successful while the previous one failed
 - **regression:** the `Unit` execution failed while the previous one was successful
"""

inhibitor = """
An `Inhibitor` describes when the execution of a `Unit` should be skipped, ie:

 - during a migration
 - during a backup restore
 - outside work hours
"""
+++

# Setting up

**Kubirds** is distributed as a *Kubernetes Operator* and, as such, will
require a working *Kubernetes Cluster*.

In the next part of this guide, we will assume that your cluster is up and
running, and that `kubectl` is properly configured.

**Kubirds** is cloud-agnostic, meaning it will work flawlessly on any cloud
provider, such as:

 - [DigitalOcean Kubernetes](#link-to-marketplace)
 - [Google Kubernetes Engine](#link-to-marketplace)
 - [Amazon Elastic Kubernetes Service](#link-to-marketplace)
 - [Microsoft Azure Kubernetes Service](#link-to-marketplace)
 - ...

> **NB:** This guide describes the installation method for the *Freemium*
> version of **Kubirds**. If you are interested by the
> [complete version](/offers/), please contact us.

{{< call-to-action "Contact us &rarr;" "/contact/?kind=offers" >}}

## Requirements

In this guide, we will install **Kubirds** in the `monitoring-system`
namespace, feel free to change it to your preferences. To create the namespace,
run the command below:

```shell
kubectl create namespace monitoring-system
```

**Kubirds** relies on other technologies to implement the supervision behavior.

In the next part of this guide, we will set up those dependencies.

> **NB:** The installation procedures for those dependencies described here are
> only one of many.
>
> These instructions will help you deploy Kubirds on a brand new Kubernetes
> cluster.
>
> If you already deployed those components, you can skip to the next part of
> this guide.

### TektonCD

[TektonCD](https://tekton.dev) is a Cloud Native CI/CD solution. **Kubirds**
relies on it to build and run your supervision pipelines.

There are currently 2 methods to deploy **TektonCD**:

#### Deploy manually

To install the core component of Tekton, Tekton Pipelines, run the command
below:

```shell
kubectl apply -f "https://storage.googleapis.com/tekton-releases/pipeline/latest/release.yaml"
```

It may take a few moments before the installation completes. You can check the
progress with the following command:

```shell
kubectl get pods --namespace tekton-pipelines
```

Confirm that every component listed has the status `Running`.

> **NB:** TektonCD is composed of 3 components:
>
>  - Tekton Pipelines: define and execute Tasks and Pipelines
>  - Tekton Triggers: listen for events, and trigger the execution of Tasks and Pipelines
>  - Tekton Dashboard: visualize your tasks and pipelines
>
> **Kubirds** only needs *Tekton Pipelines*, but feel free to deploy the other
> components as well.

#### Deploy with the Tekton Operator

First, install the operator with the following command:

```shell
kubectl apply -f "https://storage.googleapis.com/tekton-releases/operator/latest/release.yaml"
```

Then, create the following resource to deploy the Tekton components:

```yaml
---
apiVersion: operator.tekton.dev/v1alpha1
kind: TektonConfig
metadata:
  name: config
spec:
  profile: lite
  targetNamespace: pipeline-system
```

There are 3 profiles availables:

 - **lite:** installs *Tekton Pipelines*
 - **basic:** installs *Tekton Pipelines* and *Tekton Triggers*
 - **all:** install all components

## Deploying the Kubirds Operator

**Kubirds** is deployed through an [Helm](https://helm.sh) Chart.

Deploy the *Helm Chart* by running the following commands:

```shell
helm repo add link-society-incubator "https://charts.link-society.com/incubator"
helm repo update
helm upgrade --install \
    kubirds link-society-incubator/kubirds \
    --namespace monitoring-system \
    --wait
```

# Implement your supervision

In this example, we'll set up monitoring for this website.

We want to verify that the website is accessible, and be notified on
[Slack](https://slack.com) as soon as it's not the case.

We'll perform a simple `curl` every 5 minutes in a `Unit` and trigger a
`Reactor` when things go bad, and once they are back to normal.

## Your first unit

In order to schedule the `curl` command **every 5 minutes**, we'll use the
`curlimages/curl:latest` Docker image.

Create the following resource on your Kubernetes cluster:

```yaml
---
apiVersion: kubirds.com/v1
kind: Unit
metadata:
  name: check-kubirds-access
  namespace: default
  labels:
    app: kubirds-www
spec:
  schedule: every 5 minutes
  image:
    name: curlimages/curl:latest
    pullPolicy: Always
    command: >
      curl -L -v $HOST
  env:
    - name: HOST
      value: https://kubirds.com
```

## Your first reactor

Now, we want to notify a **Slack** channel. Make sure you created a
[Slack Webhook](https://api.slack.com/messaging/webhooks).

Once your *Slack Webhook* is created, create a secret on your Kubernetes
cluster containing its URL, for example:

```yaml
---
apiVersion: v1
kind: Secret
metadata:
  name: my-slack-webhook
  namespace: default
stringData:
  URL: "<YOUR WEBHOOK URL>"
```

In order to notify **Slack**, we'll also use `curl` to push the notification.

Create the following resource on your Kubernetes cluster:

```yaml
---
apiVersion: kubirds.com/v1
kind: Reactor
metadata:
  name: slack-notifier
  namespace: default
spec:
  unitSelector:
    app: kubirds-www
  triggers:
    success: no
    failure: no
    fixed: yes
    regression: yes
  image:
    name: curlimages/curl:latest
    pullPolicy: Always
    command: >
      curl -X POST $HOST -H "Content-Type: application/json" \
           -d "{ \"text\": \"$UNIT_NAME reported state $UNIT_STATE\" }"
  env:
    - name: HOST
      valueFrom:
        secretKeyRef:
          name: my-slack-webhook
          key: URL
```

Once the site is down, you'll receive the following notification on **Slack**:

![Regression](/img/getting-started/screenshots/slack-notify-regression.png)

And once it's back to normal:

![Fixed](/img/getting-started/screenshots/slack-notify-fixed.png)

# What's next

**Kubirds** comes with a lot of integrations with other systems out of the box.
Those will help you build your supervision with ease.

{{< call-to-action "Browse our catalog &rarr;" "/integrations/" >}}

If you wish to dive deeper into **Kubirds** features and inner workings, please
consult the [Documentation](/docs/).
