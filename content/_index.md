+++
title = "Home"

[video]

title = "Kubirds: Cloud Native Supervision Engine"
url = "https://www.youtube.com/embed/tZR-sreYmZo"

[preview]

description1 = """
**Kubirds** is a powerful and flexible **Cloud-Native framework to operate your
supervision**, allowing developers and operators to **observe and react to events
in their infrastructure** across cloud providers and on-premise systems.

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

[carousel]

autoplay = false
autoplay_speed = 5000
duration = "750"
navigation_keys = true
navigation_swap = true
pagination = false
navigation = false

[[carousel.slides]]

domain = "👀 Monitoring"
caption = "Upgrade and scale your monitoring"
url = "/img/schemas/monitoring.svg"

[[carousel.slides]]

domain = "🧑🏻‍💻 GitOps"
caption = "Operate your cluster the GitOps way"
url = "/img/schemas/gitops.svg"

[[carousel.slides]]

domain = "💾 Backup"
caption = "Automate your Backups for durability"
url = "/img/schemas/backup.svg"

[[carousel.slides]]

domain = "💸 FinTech"
caption = "Make your own trading bot"
url = "/img/schemas/fintech.svg"

[[carousel.slides]]

domain = "🤖 AI"
caption = "Integrate your Machine Learning workflow"
url = "/img/schemas/machine-learning.svg"

[[carousel.slides]]

domain = "🍃 Green IT"
caption = "Optimize the consumption of your resources"
url = "/img/schemas/green-it.svg"

[[integrations]]

image = "/img/integrations/prometheus.png"
url = "https://prometheus.io/"

[[integrations]]

image = "/img/integrations/nagios.png"
url = "https://www.nagios.org/"

[[integrations]]

image = "/img/integrations/datadog.png"
url = "https://www.datadoghq.com/"

[[integrations]]

image = "/img/integrations/splunk.png"
url = "https://www.splunk.com/"

[[integrations]]

image = "/img/integrations/postgresql.png"
url = "https://www.postgresql.org/"

[[integrations]]

image = "/img/integrations/mysql.png"
url = "https://www.mysql.com/"

[[integrations]]

image = "/img/integrations/mongodb.png"
url = "https://www.mongodb.com/"

[[integrations]]

image = "/img/integrations/hasura.png"
url = "https://hasura.io"


[[integrations]]

image = "/img/integrations/slack.png"
url = "https://slack.com/"

[[integrations]]

image = "/img/integrations/discord.png"
url = "https://discord.com/"

[[integrations]]

image = "/img/integrations/telegram.png"
url = "https://telegram.org/"

[[integrations]]

image = "/img/integrations/mailjet.png"
url = "https://mailjet.com/"

+++
