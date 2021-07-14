+++
title = "Schema"
description = "Custom Resource Definition"
weight = 2
markup = "mmark"
+++

{.table .is-hoverable .is-fullwidth}
| API Group | Version | Kind |
| --------- | ------- | ---- |
| kubirds.com | v1 | Reactor |

## Reactor

{.table .is-hoverable .is-fullwidth}
| Name | Type | Description |
| ---- | ---- | ----------- |
| spec | [ReactorSpec](#reactorspec) | Specification of the desired behavior |

## ReactorSpec

{.table .is-hoverable .is-fullwidth}
| Name | Type | Description |
| ---- | ---- | ----------- |
| image | [Image](#image) | Describe the Docker image to use for the reactor |
| env | [EnvVar](https://v1-20.docs.kubernetes.io/docs/reference/generated/kubernetes-api/v1.20/#envvar-v1-core) array | List of environment variables to set in the container |
| envFrom | [EnvFromSource](https://v1-20.docs.kubernetes.io/docs/reference/generated/kubernetes-api/v1.20/#envfromsource-v1-core) array | List of sources to populate environment variables in the container |
| volumes | [Volume](#volume) array | List of volumes to mount in the container |
| unitSelector | Map | Kubernetes labels used to select units to inhibit |
| emptySelectorBehavior | [EmptySelectorBehavior](#emptyselectorbehavior) | Describe the unit selection behavior when the selector is empty |
| triggers | [Triggers](#triggers) | Describe when the reactor should run |

## Image

{.table .is-hoverable .is-fullwidth}
| Name | Type | Description |
| ---- | ---- | ----------- |
| name | string | Docker image name (ie: `alpine:latest`) |
| pullPolicy | [ImagePullPolicy](#imagepullpolicy) | When to pull the image |
| command | string | Command to execute inside the container |

## ImagePullPolicy

One of:

 - `Always`
 - `Never`
 - `IfNotPresent`

## Volume

Same as a Kubernetes [Volume](https://v1-20.docs.kubernetes.io/docs/reference/generated/kubernetes-api/v1.20/#volume-v1-core) but with those extra properties:

{.table .is-hoverable .is-fullwidth}
| Name | Type | Description |
| ---- | ---- | ----------- |
| path | string | Mount path in the container |

## EmptySelectorBehavior

One of:

 - `MatchAll`: will match all units
 - `MatchNone`: will match no units

If not set, this defaults to `MatchAll`.

## Triggers

{.table .is-hoverable .is-fullwidth}
| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| success | boolean | true | If true, will be triggered for every successful unit |
| failure | boolean | true | If true, will be triggered for every failed unit |
| fixed | boolean | false | If true, will be trigger on a successful unit, previously failed |
| regression | boolean | false | If true, will be trigger on a failed unit, previously successful |
