+++
title = "Container contract"
description = "Constraints required by Kubirds"
weight = 1
markup = "mmark"
+++

In order to use a Docker image as a `Reactor`, it is mandatory that the image respects the following constraints:

 - no `ENTRYPOINT`, [Tekton](https://tekton.dev) will overwrite it when scheduling the check execution
 - no `CMD`, Kubirds will overwrite it when creating the check pipeline
 - presence of `/bin/sh`, it will be used as main shell for the container's `CMD` script

The following environment variables will be provided at runtime:

{.table .is-hoverable .is-fullwidth}
| Variable | Example | Description |
| -------- | ------- | ----------- |
| `UNIT_NAME` | `my-unit` | Name of the Unit triggering this Reactor |
| `UNIT_NAMESPACE` | `default` | Namespace of the Unit triggering this Reactor |
| `UNIT_LABELS_JSON` | `{}` | Labels of the Unit triggering this Reactor as a JSON map |
| `UNIT_LABEL_*` | `foo` | Each label of the Unit will be injected as an environment variable |
| `UNIT_ANNOTATIONS_JSON` | `{}` | Annotations of the Unit triggering this Reactor as a JSON map |
| `UNIT_ANNOTATION_*` | `foo` | Each annotation of the Unit will be injected as an environment variable |
| `UNIT_OUTPUT` | `/tmp/unit-output` | Path to the file containing the last 2048 bytes of the unit's output |
| `UNIT_STATE` | `0` | Unit's exit code |

For example, the following Unit:

```yaml
---
apiVersion: kubirds.com/v1
kind: Unit
metadata:
  name: my-check
  namespace: default
  labels:
    notify: slack
  annotations:
    example.com/kind: check
spec:
  # ...
```

Will produce the following environment:

```bash
export UNIT_NAME="my-check"
export UNIT_NAMESPACE="default"
export UNIT_LABELS_JSON='{"notify": "slack"}'
export UNIT_LABEL_NOTIFY="slack"
export UNIT_ANNOTATIONS_JSON='{"example.com/kind": "check"}'
export UNIT_ANNOTATION_EXAMPLE_COM_KIND="check"
export UNIT_OUTPUT="/tmp/unit-output"
export UNIT_STATE="0"
```
