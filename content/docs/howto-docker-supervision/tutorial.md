+++
title = "tutorial"
desciption = "supervise your website"
+++

# Introduction

> First, be sure to have read the [getting-started guide](/getting-started) before continuing this section for installing Kubevisor.

In this tutorial, you will learn to supervise your website and being notified on your slack account in few minutes.

For doing this,

1. you will define a unit in charge of doing http request to your website, and with metadata labels which will allow Kubevisor to associate it to further reactors and inhibitors.
2. then, you will define a reactor in charge of trigger unit state change and publish a message on a slack channel
3. Finally, you will specifies an inhibitor in charge of avoiding unit execution during week-ends.

# Pratice

## 1. Check every 5 minutes your website availability with a Unit

Create the following kubernetes custom resource identified by its name:

```yaml
---
apiVersion: kubevisor.io/v1
kind: Unit
metadata:
    name: check-mywebsite-access
    labels:
        notify-slack: "yes"
        active-during-weekend: "no"
spec:
    image:
        name: curlimages/curl:latest
        command: "-L -v $HOST"
        pullPolicy: Always
    env:
        - name: HOST
        value: https://myweb.site
schedule: every 5 minutes
```

> `image` property designates a docker image with a specific check command if necessary

> `env` fills image property values

> `labels` will be used for dynamic matching with

> - notify-slack: associated to kubevisor slack reactor for being notified on a slack workspace
> - active-during-weekend: associated to kubevisor inhibitor for avoiding checks during weekends

See the [unit schema](/docs/concepts/unit/schema) for more information

## 2. Trigger your website availability status with a Reactor

Create the following kubernetes custom resource:

```yaml
---
apiVersion: kubevisor.io/v1
kind: Reactor
metadata:
    name: notify-slack
spec:
    unitSelector:
        notify-slack: "yes"
    image:
        name: alpine/curl:latest
        pullPolicy: Always
        command: -X POST $HOST -H "Content-Type: application/json" \
            -d '{ "text": "state: $UNIT_STATE,output: $UNIT_OUTPUT" }'
    env:
        - name: HOST
            valueFrom:
            name: my-secret
            key: SLACK_WEBHOOK_URL
```

> Thanks to `spec.unitSelector` and `spec.image` properties, the reactor triggers corresponding labelized unit check status with `notify-slack` value and send notification to a slack channel identified with input `SLACK_WEBHOOK_URL` env var.

> Env variables `$UNIT_STATE` and `$UNIT_OUTPUT` correspond respectively to unit state integer code (not 0 is an error), and unit output file path.

See the [reactor schema](/docs/concepts/reactor/schema) for more information

## 3. Avoid unit state checking during nights and week-ends with an Inhibitor

Create the following kubernetes custom resource:

```yaml
---
apiVersion: kubevisor.io/v1
kind: Inhibitor
metadata:
    name: weekend-shutdown
spec:
    startDate: "2020-09-19T00:00:00.000Z"
    duration: 2 days
    schedule: every week
    unitSelector:
        active-during-weekend: "no"
```

> Thanks to the property `unitSelector`, this inhibitor avoid corresponding labelized unit to fire check state update.
It is parameterized for starting the Septembre, 19, 2020, during 2 days and scheduled every week

See the [inhibitor schema](/docs/concepts/inhibitor/schema) for more information

# Conclusion

As you can see, doing supervision with **`Kubevisor`** is as simple and fast as deploying a Kubernetes pod, with a very human friendly language for scheduling check frequency.

If you need advanced supervision features, such as a dedicated dashboard or a GraphqlAPI API, we invite you to go beyond by doing the [dashboard tutorial](/docs/dashboard/tutorial.md) or by <a href="/contact" data-fancybox="" data-type="iframe">contacting us for making an audit of your needs and accompagning you in your supervision project
</a>.

Enjoy !
