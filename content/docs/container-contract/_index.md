+++
title = "Container contract"
image = "<img src=\"/gfx/Logo_Docker.svg\" alt=\"\" />"
description = "Requirements for Docker containers"
layout = "chapter"
weight = 10
+++

The containers used by `Check` and `Notifier` resources will be used as steps
in [Tekton](https://tekton.dev) `Task` resources.

Therefore, they must follow the prerequisites of *Tekton*:

 - no `ENTRYPOINT`, [Tekton](https://tekton.dev) will overwrite it when scheduling the check execution

More constraints are required specifically by *Kubevisor*.