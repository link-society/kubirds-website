+++
title = "curl for GraphQL"
description = "Query or mutate a GraphQL endpoint"
kind = "Docker"
pricing = "FREE"
+++

# Introduction

This Docker image includes [graphqurl](https://github.com/hasura/graphqurl),
use it in a Unit or Reactor to execute GraphQL queries and mutations.

# Usage

## Example of Unit

```yaml
---
apiVersion: kubirds.com/v1
kind: Unit
metadata:
  name: get-gql-data
spec:
  schedule: every 5 minutes
  image:
    name: linksociety/graphqurl:latest
    pullPolicy: Always
    command: |
      gq $ENDPOINT \
        -H "Authorization: Bearer $TOKEN" \
        -q "query { some { data } }"
  env:
    - name: ENDPOINT
      value: "https://my-graphql-endpoint/graphql"
    - name: TOKEN
      value: some-secret-token
```

## Example of Reactor

```yaml
---
apiVersion: kubirds.com/v1
kind: Reactor
metadata:
  name: mutate-gql-api
spec:
  unitSelector:
    format: json
  triggers:
    success: yes
    fixed: yes
    failure: no
    regression: no
  image:
    name: linksociety/graphqurl:latest
    pullPolicy: Always
    command: |
      jq_transform=jq 'with_entries(select([.key] | inside(["myvar"])))'
      cat $UNIT_OUTPUT | $jq_transform > vars.json

      gq $ENDPOINT \
        -H "Authorization: Bearer $TOKEN" \
        -q "mutation ($myvar: String) { report(val: $myvar) { data } }" \
        --variablesFile=vars.json
  env:
    - name: ENDPOINT
      value: "https://my-graphql-endpoint/graphql"
    - name: TOKEN
      value: some-secret-token
```
