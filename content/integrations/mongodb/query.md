+++
title = "Query"
description = "Execute scripts with the MongoDB Shell"
kind = "Unit"
pricing = "FREE"
+++

# Introduction

This Docker image includes the [MongoDB Shell](https://docs.mongodb.com/mongodb-shell/),
use it to query a MongoDB database inside a Kubirds unit.

# Usage

## Environment


| Variable | Default | Description |
| --- | --- | --- |
| `DATABASE_URL` | N/A | MongoDB connection URL to your database |
| `MONGO_SCRIPTS_DIR` | N/A | Path to the volume containing your scripts (ending with `.js` or `.mongodb`) |

## Example of Unit

```yaml
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: my-mongo-scripts
data:
  getUserCount.js: |
    db = db.getSiblingDB("admin");
    printjson(db.system.users.countDocuments());

---
apiVersion: kubirds.com/v1
kind: Unit
metadata:
  name: get-mongo-usercount
spec:
  image:
    name: linksociety/kubirds-unit-mongosh:latest
    pullPolicy: Always
    command: run-mongo-scripts
  env:
    - name: DATABASE_URL
      valueFrom:
        secretKeyRef:
          name: mongodb-access
          key: URL
    - name: MONGO_SCRIPTS_DIR
      value: /scripts
  volumes:
    - name: mongo-scripts
      mountPath: /scripts
      configMap:
        name: my-mongo-scripts
```
