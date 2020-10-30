+++
title = "Schema"
description = "Custom Resource Definition"
weight = 3
+++

| API Group | Version | Kind |
| --------- | ------- | ---- |
| kubevisor.io | v1 | Reactor |

## Reactor

| Name | Type | Description |
| ---- | ---- | ----------- |
| spec | [ReactorSpec](#ReactorSpec) | Specification of the desired behavior |

## ReactorSpec

| Name | Type | Description |
| ---- | ---- | ----------- |
| image | [Image](#Image) | Describe the Docker image to use for the reactor |
| duration | string | Describe how long the unit must be inhibited, ie: `1 hour` |
| startDate | string | Describe the beginning of the schedule, ISO formated date and time |
| unitSelector | Map | Kubernetes labels used to select units to inhibit |
