+++
title = "Home"

[video]

title = "Kubirds: Cloud Native Supervision Engine"
url = "https://www.youtube.com/embed/tZR-sreYmZo"

[introduction.engine]

title = "The first Cloud-Native Supervision Engine"

description = """
**Kubirds** is a powerful and flexible **Cloud-Native framework to operate your
supervision**, allowing developers and operators to **observe and react to events
in their infrastructure** across cloud providers and on-premise systems.
"""

call_to_action = { name = "Get started &rarr;", url = "/getting-started/" }

image = "/img/home/engine.png"

[introduction.reusable]

title = "Built for reusability"
description = """
Encapsulate your workflow in **Docker images** and **reuse them heavily** in
any job. Kubirds' reactivity is **Plug'n'play**, allowing you to **attach,
update and remove** your automated incident-response workflow **without**
interfering with your observability workflow.
"""

call_to_action = { name = "Learn more &rarr;", url = "/docs/dockerized-supervision/" }

image = "/img/home/reuse.svg"

[example.unit]

title = "Better observability"
description = """
Use Kubirds' **Units** to modelize the core of your supervision. **Observe** for
changes in your infratructure with **little to zero** configuration.
**Schedule** your workflows with ease, and let your supervision **scale** with
your Kubernetes cluster.
"""

code = """
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

[example.reactor]

title = "Fine-grained reactivity"
description = """
**React** to the results of many Units with Kubirds' **Reactors**. Select
**precisely** what you're reacting to and **when** a response should be
triggered. **Notify or mutate** external systems based on changes detected by
your supervision.
"""

code = """
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

[integrations]

title = "Integrated with systems you already use"
description = """
Choose from tons of the **ready-to-use** units and reactors to connect
**Kubirds** to your preferred monitoring, alerting, database, and custom
systems.
"""
+++
