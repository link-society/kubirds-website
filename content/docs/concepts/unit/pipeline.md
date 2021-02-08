+++
title = "Pipeline"
description = "Unit Execution Pipeline"
weight = 1
+++


When a unit is created, a message is sent over [RabbitMQ](https://rabbitmq.com) to be consumed by a **worker**.

The work