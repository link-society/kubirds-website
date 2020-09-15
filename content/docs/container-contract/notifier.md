+++
title = "Notifier Container contract"
description = "Constraints required by Kubevisor"
weight = 12
+++

### Notifier Container Contract

 - no `ENTRYPOINT`, [Tekton](https://tekton.dev) will overwrite it when scheduling the check execution
 - no `CMD`, Kubevisor will overwrite it when creating the check pipeline
 - presence of `/bin/sh`, it will be used as main shell for the container's `CMD` script
 - presence of `/run-notifier.sh`, it will be used inside the container's `CMD` script:
    - `$1` is the path to the file containing the check's output
    - `$2` is the check's exit code
