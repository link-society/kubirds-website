+++
title = "Container contract"
description = "Requirements for Docker containers"
date = 2020-01-04T17:24:00+01:00
weight = 20
draft = false
bref = "Requirements for Docker containers"
toc = true
+++

### Check Container Contract

 - no `ENTRYPOINT`, [Tekton](https://tekton.dev) will overwrite it when scheduling the check execution
 - no `CMD`, Kubevisor will overwrite it when creating the check pipeline
 - presence of `/bin/sh`, it will be used as main shell for the container's `CMD` script
 - presence of `/run-check.sh`, it will be used inside the container's `CMD` script:
    - `stderr` & `stdout` will be used as check output, only the last 2048 bytes will be used<sup><a href="#note-1">1</a></sup>
    - exit code `0` on successful healthcheck
    - exit code different than `0` on failed healthcheck

**<span id="note-1">[1]</span>**: this limitation **will** be removed in future versions, it's dependent on a WIP feature from Tekton.

### Notifier Container Contract

 - no `ENTRYPOINT`, [Tekton](https://tekton.dev) will overwrite it when scheduling the check execution
 - no `CMD`, Kubevisor will overwrite it when creating the check pipeline
 - presence of `/bin/sh`, it will be used as main shell for the container's `CMD` script
 - presence of `/run-notifier.sh`, it will be used inside the container's `CMD` script:
    - `$1` is the path to the file containing the check's output
    - `$2` is the check's exit code

