+++
title = "Container contract"
description = "Constraints required by Kubirds"
weight = 1
+++

In order to use a Docker image as a `Unit`, it is mandatory that the image respects the following constraints:

 - no `ENTRYPOINT`, [Tekton](https://tekton.dev) will overwrite it when scheduling the check execution
 - no `CMD`, Kubirds will overwrite it when creating the unit pipeline
 - presence of `/bin/sh`, it will be used as main shell for the container's `CMD` script
