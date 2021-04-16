+++
title = "Schema"
description = "Custom Resource Definition"
weight = 2
+++

| API Group | Version | Kind |
| --------- | ------- | ---- |
| kubirds.com | v1 | Inhibitor |

## Inhibitor

| Name | Type | Description |
| ---- | ---- | ----------- |
| spec | [InhibitorSpec](#InhibitorSpec) | Specification of the desired behavior |

## InhibitorSpec

| Name | Type | Description |
| ---- | ---- | ----------- |
| schedule | string | Describe when the unit must be inhibited. RRule in human readable format or standard format (see [RRule Spec](#spec)), ie: `every 5 minutes` |
| duration | string | Describe how long the unit must be inhibited, ie: `1 hour` |
| startDate | string | Describe the beginning of the schedule, ISO formated date and time |
| unitSelector | Map | Kubernetes labels used to select units to inhibit |
