+++
title = "Schema"
description = "Custom Resource Definition"
weight = 2
markup = "mmark"
+++

{.table .is-hoverable .is-fullwidth}
| API Group | Version | Kind |
| --------- | ------- | ---- |
| kubirds.com | v1 | Inhibitor |

## Inhibitor

{.table .is-hoverable .is-fullwidth}
| Name | Type | Description |
| ---- | ---- | ----------- |
| spec | [InhibitorSpec](#inhibitorspec) | Specification of the desired behavior |

## InhibitorSpec

{.table .is-hoverable .is-fullwidth}
| Name | Type | Description |
| ---- | ---- | ----------- |
| schedule | string | Describe when the unit must be inhibited. RRule in human readable format or standard format (see [RRule Spec](#spec)), ie: `every 5 minutes` |
| duration | string | Describe how long the unit must be inhibited, ie: `1 hour` |
| startDate | string | Describe the beginning of the schedule, ISO formated date and time |
| unitSelector | Map | Kubernetes labels used to select units to inhibit |
| emptySelectorBehavior | [EmptySelectorBehavior](#emptyselectorbehavior) | Describe the unit selection behavior when the selector is empty |

## EmptySelectorBehavior

One of:

 - `MatchAll`: will match all units
 - `MatchNone`: will match no units

If not set, this defaults to `MatchAll`.
