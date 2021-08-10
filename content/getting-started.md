+++
title = "Getting Started"
layout = "getting-started"
markup = "mmark"

toc = true

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

[carousel]

autoplay = false
autoplay_speed = 5000
duration = "750"
navigation_keys = true
navigation_swap = true
pagination = false
navigation = false

[[schema]]

domain = "⚙️ Generic use"
caption = "Use generic concepts to represent your supervision"
url = "/img/getting-started/schemas/generic.svg"

[[schema]]

domain = "👀 Monitoring"
caption = "Upgrade and scale your monitoring"
url = "/img/getting-started/schemas/monitoring.svg"

[[schema]]

domain = "🧑🏻‍💻 GitOps"
caption = "Operate your cluster the GitOps way"
url = "/img/getting-started/schemas/gitops.svg"

[[schema]]

domain = "💾 Backup"
caption = "Automate your Backups for durability"
url = "/img/getting-started/schemas/backup.svg"

[[schema]]

domain = "💸 FinTech"
caption = "Make your own trading bot"
url = "/img/getting-started/schemas/fintech.svg"

[[schema]]

domain = "🤖 AI"
caption = "Integrate your Machine Learning workflow"
url = "/img/getting-started/schemas/machine-learning.svg"

[[schema]]

domain = "🍃 Green IT"
caption = "Optimize your resource consumption"
url = "/img/getting-started/schemas/machine-learning.svg"

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

### RabbitMQ

[RabbitMQ](https://rabbitmq.com) is a very robust message broker, implementing
the [AMQP](https://en.wikipedia.org/wiki/Advanced_Message_Queuing_Protocol)
protocol.

**Kubirds** relies on it to balance the workload across all of its replicas.
Whenever a `Unit` is scheduled, a message is published to the message broker,
allowing one of the replicas to receive the message and trigger the `Unit`'s
execution.

We recommend to install the [RabbitMQ Cluster Operator](https://www.rabbitmq.com/kubernetes/operator/operator-overview.html)
in order to set up this dependency. You can do so by running the command below:

```shell
kubectl apply -f "https://github.com/rabbitmq/cluster-operator/releases/latest/download/cluster-operator.yml"
```

You can then deploy a **RabbitMQ Cluster** by creating the following resource:

```yaml
---
apiVersion: rabbitmq.com/v1beta1
kind: RabbitmqCluster
metadata:
  name: kubirds-rabbitmq
  namespace: monitoring-system
```

### Redis

[Redis](https://redis.io) is an in-memory data structure store.

**Kubirds** relies on it to temporarily store logs and metrics produced by a
`Unit` and consumed by a `Reactor`.

We recommend installing the following
[Redis Operator](https://github.com/spotahome/redis-operator) in order to set
up this dependency. You can do so by running the command below:

```shell
kubectl apply -f "https://raw.githubusercontent.com/spotahome/redis-operator/master/example/operator/all-redis-operator-resources.yaml"
```

You can then deploy a **Redis Cluster** by creating the following resource:

```yaml
---
apiVersion: databases.spotahome.com/v1
kind: RedisFailover
metadata:
  name: kubirds-redis
  namespace: monitoring-system
spec:
  sentinel:
    replicas: 3
    resources:
      requests:
        cpu: 100m
      limits:
        memory: 100Mi
  redis:
    replicas: 3
    resources:
      requests:
        cpu: 100m
        memory: 100Mi
      limits:
        cpu: 400m
        memory: 500Mi
```

## Deploying the Kubirds Operator

**Kubirds** is deployed through an [Helm](https://helm.sh) Chart. As of now,
the Chart doesn't deploy the necessary RBAC configuration, and access to
**RabbitMQ** and **Redis** is configured through Kubernetes Secrets.

In the next part of this guide, we will create the necessary configuration for
the Chart installation.

### Roles and Permissions

#### RBAC Manager

Before deploying **Kubirds**, we need to set up the RBAC for it. We recommend
installing [RBAC Manager](https://rbac-manager.docs.fairwinds.com/) to
facilitate RBAC definitions, you can do so by running the commands below:

```shell
kubectl create namspace rbac-manager
helm repo add fairwinds "https://charts.fairwinds.com/stable"
helm repo update
helm upgrade --install \
    rbac-manager fairwinds/rbac-manager \
    --namespace rbac-manager \
    --wait
```

#### Roles

**Kubirds** will need 2 roles to work properly:

 - `kubirds-controller`: required to manage the `Unit`, `Reactor` and `Inhibitor`
   resources
 - `kubirds-status-updater`: required to update the `Unit`'s status

Additionally, you will need 2 more roles to interact with **Kubirds**:

 - `kubirds-account-view`: minimum required permissions to visualize your
   supervision configuration
 - `kubirds-account-edit`: minimum required permissions to edit your
   supervision configuration

You can create those roles with the following resources:

```yaml
---
# Grants a user the ability to view the monitoring configuration
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: kubirds-account-view
rules:
  - apiGroups: ["apiextensions.k8s.io"]
    resources: ["customresourcedefinitions"]
    verbs: ["get", "watch", "list"]
  - apiGroups: [""]
    resources: ["pods", "pods/log", "namespaces", "secrets", "configmaps"]
    verbs: ["get", "watch", "list"]
  - apiGroups: ["kubirds.com"]
    resources: ["units", "reactors", "inhibitors"]
    verbs: ["get", "watch", "list"]

---
# Grants a user the ability to modify the monitoring configuration
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: kubirds-account-edit
rules:
  - apiGroups: [""]
    resources: ["namespaces", "secrets", "configmaps"]
    verbs: ["create", "update", "patch", "delete"]
  - apiGroups: ["kubirds.com"]
    resources: ["units", "reactors", "inhibitors"]
    verbs: ["create", "update", "patch", "delete"]

---
# Grants a user the ability to run the Kubirds controller
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: kubirds-controller
rules:
  - apiGroups: ["apiextensions.k8s.io"]
    resources: ["customresourcedefinitions"]
    verbs: ["get", "watch", "list", "create", "update", "patch", "delete"]
  - apiGroups: [""]
    resources: ["pods", "pods/log", "namespaces"]
    verbs: ["get", "watch", "list"]
  - apiGroups: [""]
    resources: ["secrets"]
    verbs: ["get", "list", "create", "update", "patch", "delete"]
  - apiGroups: ["tekton.dev"]
    resources: ["pipelines", "pipelineruns"]
    verbs: ["get", "watch", "list", "create", "update", "patch", "delete"]
  - apiGroups: ["kubirds.com"]
    resources: ["units", "reactors", "inhibitors"]
    verbs: ["get", "watch", "list", "create", "update", "patch", "delete"]

---
# Grants a user the ability to run a Kubirds pipeline
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: kubirds-status-updater
rules:
  - apiGroups: ["kubirds.com"]
    resources: ["units"]
    verbs: ["patch"]
```

#### Service Accounts

In order to be able to run `Unit` and `Reactor` resources in a namespace,
**Kubirds** will need a `kubirds-operator` ServiceAccount in that namespace.

For example, in the `default` namespace, create the following resource:

```yaml
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: kubirds-operator
  namespace: default
```

#### Role bindings

The final step is to bind the roles to your service accounts. In this example,
we will give the roles `kubirds-account-view` and `kubirds-account-edit` to the
`default` service account.

If you installed **RBAC Manager**, you can set up everything by create the
following resource:

```yaml
---
apiVersion: rbacmanager.reactiveops.io/v1beta1
kind: RBACDefinition
metadata:
  name: kubirds-basic
rbacBindings:
  # Required by Kubirds to work properly
  - name: controller
    subjects:
      - kind: ServiceAccount
        name: default
        namespace: monitoring-system
    roleBindings:
      - clusterRole: kubirds-controller
        namespace: monitoring-system
  - name: unit-runner-default
    subjects:
      - kind: ServiceAccount
        name: kubirds-operator
        namespace: default
    roleBindings:
      - clusterRole: kubirds-status-updater
        namespace: default
  # Required by you to manage Kubirds
  - name: user-access-default
    subjects:
      - kind: ServiceAccount
        name: default
        namespace: default
    roleBindings:
      - clusterRole: kubirds-account-view
        namespace: default
      - clusterRole: kubirds-account-edit
        namespace: default
```

### Dependencies access

If you installed **Kubirds**' dependencies by following the previous section, you can
create those Secrets with the following script:

```bash
#!/usr/bin/env bash

RABBITMQ_HOST="kubirds-rabbitmq.monitoring-system.svc.cluster.local"
RABBITMQ_USERNAME="$(kubectl get -n monitoring-system secret kubirds-rabbitmq-default-user -o jsonpath='{.data.username}' | base64 --decode)"
RABBITMQ_PASSWORD="$(kubectl get -n monitoring-system secret kubirds-rabbitmq-default-user -o jsonpath='{.data.password}' | base64 --decode)"
RABBITMQ_URL="amqp://${RABBITMQ_USERNAME}:${RABBITMQ_PASSWORD}@${RABBITMQ_HOST}:5672/"

REDIS_HOST="redis://rfs-kubirds-redis.monitoring-system.svc.cluster.local:26379/"

cat <<EOF | kubectl apply -f -
---
apiVersion: v1
kind: Secret
metadata:
  name: kubirds-rabbitmq-access
  namespace: monitoring-system
stringData:
  RABBITMQ_URL: ${RABBITMQ_URL}
EOF

cat <<EOF | kubectl apply -f -
---
apiVersion: v1
kind: Secret
metadata:
  name: kubirds-redis-access
  namespace: monitoring-system
stringData:
  REDIS_HOST: ${REDIS_HOST}
EOF
```

If you deployed those dependencies using a different method, you'll need to
create the following secrets:

```yaml
---
apiVersion: v1
kind: Secret
metadata:
  name: kubirds-rabbitmq-access
  namespace: monitoring-system
stringData:
  RABBITMQ_URL: <RABBITMQ URL>

---
apiVersion: v1
kind: Secret
metadata:
  name: kubirds-redis-access
  namespace: monitoring-system
stringData:
  REDIS_HOST: <REDIS URL>
```

> **NB:** Since `Unit` and `Reactor` resources are executed in their own
> namespace, the Redis secret will be copied to that namespace by **Kubirds**.

### Deploy Helm Chart

Create a file named `kubirds-operator-values.yaml` containing the following:

```yaml
controller:
  enabled: yes

  redis:
    host:
      kind: dynamic
      dynamic:
        valueFrom:
          secretKeyRef:
            name: kubirds-redis-access
            key: REDIS_HOST

  rabbitUrl:
    kind: dynamic
    dynamic:
      valueFrom:
        secretKeyRef:
          name: kubirds-rabbitmq-access
          key: RABBITMQ_URL

  serviceAccountName: kubirds-operator
```

Finally, deploy the *Helm Chart* by running the following commands:

```shell
helm repo add link-society-incubator "https://charts.link-society.com/incubator"
helm repo update
helm upgrade --install \
    kubirds link-society-incubator/kubirds \
    -f kubirds-operator-values.yaml \
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

In this guide, you've installed the *Freemium* version of **Kubirds**. It does
not include all the functionalities, such as:

 - the Web Dashboard to monitor your infrastructure in real-time
 - Unit Discovery to generate your `Unit` resources based on your Kubernetes
   services
 - Stateful Units and Reactors to share more data than just logs and metrics
 - ...

It also does not include support and maintainence. So feel free to browse our
offers adapted to your business.

{{< call-to-action "Discover our offers &rarr;" "/offers/" >}}

If you wish to dive deeper into **Kubirds** features and inner workings, please
consult the [Documentation](/docs/).

We also distribute some `Unit` and `Reactor` Docker images for various use
cases on this **Github**
[repository](https://github.com/link-society/kubirds-contrib), feel free to
check it out.
