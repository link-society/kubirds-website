+++
title = "Query"
description = "Execute SQL query against a MySQL database"
kind = "Unit"
pricing = "FREE"
+++

# Introduction

This integration allows you to schedule SQL queries against a MySQL
database.

# Usage

This integration is distributed as an Helm chart. To install it, first add the
following repository:

```shell
$ helm repo add link-society-incubator https://charts.link-society.com/incubator
$ helm repo update
```

## Values

| Value | Default | Description |
| ----- | ------- | ----------- |
| `schedule` | `every 5 minutes` | Desired scheduling for the query |
| `labels` | `{}` | Map of labels to add to the Unit |
| `dbms` | `mysql` | Type of database to query. **SHOULD NOT BE CHANGED** |
| `query` | `SELECT 1` | Query to execute |
| `cliArgs` | - | Additional arguments to pass to the MySQL client |
| `secretName` | `kubirds-sql-unit-dbms-credentials` | Name of the Kubernetes Secret containing the database credentials |
| `image.mysql.name` | `mysql` | Docker image name |
| `image.mysql.tag` | `latest` | Docker image tag |
| `image.mysql.pullPolicy` | `IfNotPresent` | Kubernetes pull policy for the Docker image |
| `serviceAccount.create` | `true` | If true, create the unit's Kubernetes ServiceAccount |
| `serviceAccount.annotations` | `{}` | Additional annotations to add to the new ServiceAccount |
| `serviceAccount.name` | - | If not provided, will be set to `default` if `serviceAccount.create` is false, or to the chart's full name if it is true |

## Credentials

The credentials information are given via a Kubernetes Secret with the following keys:

| Key | Description |
| --- | ----------- |
| `DATABASE_HOST` | DBMS Hostname |
| `DATABASE_NAME` | Database name |
| `DATABASE_USER` | Username |
| `DATABASE_PASSWORD` | Password |

## Setup

Install the unit with the following command:

```shell
$ helm install mysql-availability link-society-incubator/kubirds-sql-unit \
    --namespace default \
    --set schedule="every 5 minutes" \
    --set dbms="mysql" \
    --set secretName="mysql-credentials"
```
