+++
title = "Container contract"
description = "Constraints required by Kubevisor"
weight = 1
+++

In order to use a Docker image as a `Reactor`, it is mandatory that the image respects the following constraints:

 - no `ENTRYPOINT`, [Tekton](https://tekton.dev) will overwrite it when scheduling the check execution
 - no `CMD`, Kubevisor will overwrite it when creating the check pipeline
 - presence of `/bin/sh`, it will be used as main shell for the container's `CMD` script

The following environment variables will be provided at runtime:

| Variable | Example | Description |
| -------- | ------- | ----------- |
| `UNIT_OUTPUT` | `/tmp/unit-output` | Path to the file containing the last 2048 bytes of the unit's output |
| `UNIT_STATE` | `0` | Unit's exit code |
