+++
title = "Home"

[preview]

description1 = """
**Kubirds** is a powerful and flexible **Cloud-Native framework to operate your
supervision**, allowing developers and operators to **observe and react to events
in their infrastructure** accross cloud providers and on-premise systems.

**[Get started with the installation guide.](/getting-started/)**
"""

description2 = """
Encapsulate your workflow in **Docker images** and **reuse them heavily** in
any job. Kubirds' reactivity is **Plug'n'play**, allowing you to **attach,
update and remove** your automated incident-response workflow **without**
interfering with your observability workflow.

**[Learn more about this in our tutorials.](/docs/dockerized-supervision/)**
"""

[preview.examples]

unit = """
```yaml
---
apiVersion: kubirds.com/v1
kind: Unit
metadata:
  name: observe-infra
  namespace: default
  labels:
    domain: infra
spec:
  schedule: every 5 minutes
  image:
    name: myorga/infra-observer:latest
    pullPolicy: IfNotPresent
    command: /opt/myorga/run-infra-observer.sh
```
"""

reactor = """
```yaml
---
apiVersion: kubirds.com/v1
kind: Reactor
metadata:
  name: notify-teams
  namespace: default
spec:
  unitSelector:
    domain: infra
  image:
    name: myorga/team-notifier:latest
    pullPolicy: IfNotPresent
    command: /opt/myorga/run-team-notifier.sh
```
"""

[nav]

gettingStarted = "I want to know more, and install the **Freemium** edition on my cluster."
offers = "I need more than what the **Freemium** edition has to offer."
documentation = "I wish to learn more about **Kubirds** and how it works."

[breadcrumbs]

root = true
icon = "<i class=\"fas fa-home\"></i>"
+++
