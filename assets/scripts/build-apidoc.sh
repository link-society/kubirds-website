#!/bin/sh

set -e

# Generate complete schema
touch ./assets/schema.graphql
cat ./assets/modules/sdk/sources/node/k8s-operator/src/graphql/type-defs/*.graphql > ./assets/schema.graphql
cat ./assets/modules/operator/sources/controller/src/api/type-defs/*.graphql >> ./assets/schema.graphql

# Build API documentation from schema
npx spectaql ./assets/spectaql.yml -t static/api-doc
