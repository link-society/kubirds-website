+++
title = "Schema"
description = "Custom Resource Definition"
weight = 3
+++

| API Group | Version | Kind |
| --------- | ------- | ---- |
| kubevisor.io | v1 | Unit |

## Unit

| Name | Type | Description |
| ---- | ---- | ----------- |
| spec | [UnitSpec](#unitspec) | Specification of the desired behavior |

## UnitSpec

| Name | Type | Description |
| ---- | ---- | ----------- |
| schedule | string | Describe when the unit must be inhibited. RRule in human readable format or standard format (see [RRule Spec](https://icalendar.org/iCalendar-RFC-5545/3-8-5-3-recurrence-rule.html)), ie: `every 5 minutes` |
| image | [Image](#image) | Describe the Docker image to use for the reactor |
| env | [EnvVar](https://v1-18.docs.kubernetes.io/docs/reference/generated/kubernetes-api/v1.18/#envvar-v1-core) array | List of environment variables to set in the container |
| envFrom | [EnvFromSource](https://v1-18.docs.kubernetes.io/docs/reference/generated/kubernetes-api/v1.18/#envfromsource-v1-core) array | List of sources to populate environment variables in the container |
| volumes | [Volume](#volume) array | List of volumes to mount in the container |

## Image

| Name | Type | Description |
| ---- | ---- | ----------- |
| name | string | Docker image name (ie: `alpine:latest`) |
| pullPolicy | [ImagePullPolicy](#imagepullpolicy) | When to pull the image |
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
