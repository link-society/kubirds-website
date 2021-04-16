+++
title = "Reusability"
description = "Learn how to create generic Reactors and Inhibitors"
weight = 4
+++

# Recap

{{< read-first "/docs/dockerized-supervision/web/plan" >}}

So far, we've deployed our web service, we've created a `Unit` to monitor it,
a `Reactor` to notify our Ops team and an `Inhibitor` to shut down monitoring
during upgrades.

# Think generic

While the `Unit` is specific to our web service, the `Reactor` and `Inhibitor` are
not and could (**should**) be re-used with other units.

One possible way to do this is through the unit's labels:

```yaml
---
apiVersion: kubirds.com/v1
kind: Unit
metadata:
  name: check-my-service-access
  namespace: default
  labels:
    app: my-service
    notify: "slack"
    no-report: "weekend-night-2h"
spec:
  # ...
```

Then, in our `Reactor`, instead of using the `app` label, we simply do:

```yaml
---
apiVersion: kubirds.com/v1
kind: Reactor
metadata:
  name: notify-slack
  namespace: default
spec:
  unitSelector:
    notify: "slack"
  # ...
```

Finally, we can edit our `Inhibitor` as well:

```yaml
---
apiVersion: kubirds.com/v1
kind: Unit
metadata:
  name: upgrade-window-weekend-night-2h
  namespace: default
spec:
  unitSelector:
    no-report: "weekend-night-2h"
  # ...
```

This way, you can define only a few reactors and inhibitors, and your main concern becomes units.
