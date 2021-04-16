+++
title = "Schema"
description = "Custom Resource Definition"
weight = 2
+++

| API Group | Version | Kind |
| --------- | ------- | ---- |
| kubirds.com | v1 | Reactor |

## Reactor

| Name | Type | Description |
| ---- | ---- | ----------- |
| spec | [ReactorSpec](#ReactorSpec) | Specification of the desired behavior |

## ReactorSpec

| Name | Type | Description |
| ---- | ---- | ----------- |
| image | [Image](#Image) | Describe the Docker image to use for the reactor |
| env | [EnvVar](https://v1-18.docs.kubernetes.io/docs/reference/generated/kubernetes-api/v1.18/#envvar-v1-core) array | List of environment variables to set in the container |
| envFrom | [EnvFromSource](https://v1-18.docs.kubernetes.io/docs/reference/generated/kubernetes-api/v1.18/#envfromsource-v1-core) array | List of sources to populate environment variables in the container |
| volumes | [Volume](#Volume) array | List of volumes to mount in the container |
| unitSelector | Map | Kubernetes labels used to select units to inhibit |
| triggers | [Triggers](#Triggers) | Describe when the reactor should run |

## Image

| Name | Type | Description |
| ---- | ---- | ----------- |
| name | string | Docker image name (ie: `alpine:latest`) |
| pullPolicy | [ImagePullPolicy](#ImagePullPolicy) | When to pull the image |
| command | string | Command to execute inside the container |

## ImagePullPolicy

One of:

 - Always
 - Never
 - IfNotPresent

## Volume

Same as a Kubernetes [Volume](https://v1-18.docs.kubernetes.io/docs/reference/generated/kubernetes-api/v1.18/#volume-v1-core) but with those extra properties:

| Name | Type | Description |
| ---- | ---- | ----------- |
| path | string | Mount path in the container |

## Triggers

| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| success | boolean | true | If true, will be triggered for every successful unit |
| failure | boolean | true | If true, will be triggered for every failed unit |
| fixed | boolean | false | If true, will be trigger on a successful unit, previously failed |
| regression | boolean | false | If true, will be trigger on a failed unit, previously successful |
