+++
title = "Helm Chart"
icon = "<img src=\"/img/docs/helm-logo.svg\" alt=\"\" width=\"43\" />"
description = "Kubirds deployment configuration"
weight = 1

layout = "chapter"
markup = "mmark"
+++

{.table .is-hoverable .is-fullwidth}
| Repository | Chart Name | Chart Version |
| --- | --- | --- |
| [https://charts.link-society.com/incubator](https://charts.link-society.com/) | kubirds | 2.0.0 |

## Values

{.table .is-hoverable .is-fullwidth}
| Value | Type | Default | Description |
| --- | --- | --- | --- |
| **Core Supervision** ||||
| `coresup.enabled` | boolean | `true` | Deploys the Core Supervision features |
| **Operator** ||||
| `operator.enabled` | boolean | `true` | Deploys the Kubernetes Operator |
| `operator.nameOverride` | string | `""` | Override the Chart name (leave empty to keep the default) |
| `operator.fullnameOverride` | string | `""` | Override the Chart and Release name (leave empty to keep the default) |
| `operator.replicaCount` | integer | `1` | Number of replicas (pods) to deploy |
| `operator.image.name` | string | `linksociety/kubirds-operator` | Docker image repository to deploy |
| `operator.image.tag` | string | `2.0.0-rc3` | Docker image tag to deploy |
| `operator.image.pullPolicy` | string | `IfNotPresent` | Pull policy for the pod |
| `operator.image.pullSecrets` | string array | `[]` | List of Docker secrets to pull image from private repositories |
| `operator.tlsctlImage.name` | string | `linksociety/kubirds-tlsctl` | Docker image repository for the TLS certificate renewal tool |
| `operator.tlsctlImage.tag` | string | `2.0.0-rc3` | Docker image tag |
| `operator.tlsctlImage.pullPolicy` | string | `IfNotPresent` | Pull policy for the pod |
| `operator.cachelogImage.name` | string | `redis` | Docker image repository for the Kubirds CacheLog client |
| `operator.cachelogImage.tag` | string | `6.2.6-alpine` | Docker image tag |
| `operator.cachelogImage.pullPolicy` | string | `IfNotPresent` | Pull policy for the pod |
| `operator.statusImage.name` | string | `alpine` | Docker image repository for the Unit status updater |
| `operator.statusImage.tag` | string | `3.15` | Docker image tag |
| `operator.statusImage.pullPolicy` | string | `IfNotPresent` | Pull policy for the pod |
| `operator.serviceAccount.create` | boolean | `true` | If `true`, create a dedicated ServiceAccount for the operator |
| `operator.serviceAccount.annotations` | map | `{}` | Annotations to add to the ServiceAccount |
| `operator.serviceAccount.name` | string | `""` | If `create` is `true`, leave empty to generate a new one, otherwise, leave empty to use `default` |
| `operator.podAnnotations` | map | `{}` | Annotations to add to the operator's pods |
| `operator.podSecurityContext` | map | `{}` | Configure operator's pods security context |
| `operator.securityContext` | map | `{}` | Configure operator's main container security context |
| `operator.resources` | map | `{}` | Configure operator's pod resource `limits` and `requests` |
| `operator.autoscaling.enabled` | boolean | `false` | Enable the HorizontalPodAutoscaler |
| `operator.autoscaling.minReplicas` | integer | `1` | Minimum number of replicas |
| `operator.autoscaling.maxReplicas` | integer | `100` | Maximum number of replicas |
| `operator.autoscaling.targetCPUUtilizationPercentage` | integer | `80` | CPU threshold to spawn new replicas |
| `operator.autoscaling.targetMemoryUtilizationPercentage` | integer | N/A | Memory threshold to spawn new replicas |
| `operator.nodeSelector` | [Node Selector](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/) | `{}` | Manually select the Kubernetes nodes used to schedule the operator's pods (leave empty to select them all) |
| `operator.tolerations` | [Taint and Toleration](https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/) | `[]` | Dynamically select the Kubernetes tainted nodes used to schedule the operator's pods (leave empty to select them all) |
| `operator.affinity` | [Node Affinity](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/) | `{}` | Specify constraints required on the Kubernetes node to be selected for scheduling |
| **Dashboard** ||||
| `dashboard.enabled` | boolean | `true` | Deploys the Dashboard frontend |
| `dashboard.nameOverride` | string | `""` | Override the Chart name (leave empty to keep the default) |
| `dashboard.fullnameOverride` | string | `""` | Override the Chart and Release name (leave empty to keep the default) |
| `dashboard.replicaCount` | integer | `1` | Number of replicas (pods) to deploy |
| `dashboard.image.name` | string | `ghcr.io/link-society/kubirds-dashboard` | Docker image repository to deploy |
| `dashboard.image.tag` | string | `2.0.0-alpha1` | Docker image tag to deploy |
| `dashboard.image.pullPolicy` | string | `IfNotPresent` | Pull policy for the pod |
| `dashboard.image.pullSecrets` | string array | `[]` | List of Docker secrets to pull | `dashboard.serviceAccount.create` | boolean | `true` | If `true`, create a dedicated ServiceAccount for the dashboard |
| `dashboard.serviceAccount.annotations` | map | `{}` | Annotations to add to the ServiceAccount |
| `dashboard.serviceAccount.name` | string | `""` | If `create` is `true`, leave empty to generate a new one, otherwise, leave empty to use `default` |
| `dashboard.podAnnotations` | map | `{}` | Annotations to add to the dashboard's pods |
| `dashboard.podSecurityContext` | map | `{}` | Configure dashboard's pods security context |
| `dashboard.securityContext` | map | `{}` | Configure dashboard's main container security context |
| `dashboard.resources` | map | `{}` | Configure dashboard's pod resource `limits` and `requests` |
| `dashboard.autoscaling.enabled` | boolean | `false` | Enable the HorizontalPodAutoscaler |
| `dashboard.autoscaling.minReplicas` | integer | `1` | Minimum number of replicas |
| `dashboard.autoscaling.maxReplicas` | integer | `100` | Maximum number of replicas |
| `dashboard.autoscaling.targetCPUUtilizationPercentage` | integer | `80` | CPU threshold to spawn new replicas |
| `dashboard.autoscaling.targetMemoryUtilizationPercentage` | integer | N/A | Memory threshold to spawn new replicas |
| `dashboard.nodeSelector` | [Node Selector](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/) | `{}` | Manually select the Kubernetes nodes used to schedule the dashboard's pods (leave empty to select them all) |
| `dashboard.tolerations` | [Taint and Toleration](https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/) | `[]` | Dynamically select the Kubernetes tainted nodes used to schedule the dashboard's pods (leave empty to select them all) |
| `dashboard.affinity` | [Node Affinity](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/) | `{}` | Specify constraints required on the Kubernetes node to be selected for scheduling |
