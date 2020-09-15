+++
title = "Check Container contract"
description = "Constraints required by Kubevisor"
weight = 11
+++

### Check Container Contract

 - no `CMD`, Kubevisor will overwrite it when creating the check pipeline
 - presence of `/bin/sh`, it will be used as main shell for the container's `CMD` script
 - presence of `/run-check.sh`, it will be used inside the container's `CMD` script:
    - `stderr` & `stdout` will be used as check output, only the last 2048 bytes will be used<sup><a href="#note-1">1</a></sup>
    - exit code `0` on successful healthcheck
    - exit code different than `0` on failed healthcheck

**<span id="note-1">[1]</span>**: this limitation **will** be removed in future versions, it's dependent on a WIP feature from *Tekton*.
