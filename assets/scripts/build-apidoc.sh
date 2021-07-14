#!/bin/sh

set -e

# Clone Git repositories
git clone https://github.com/datapio/sdk.git ./sdk
git clone git@github.com:link-society/kubirds-operator.git ./operator

# Generate complete schema
touch ./assets/schema.graphql
cat sdk/sources/node/k8s-operator/src/graphql/type-defs/*.graphql > ./assets/schema.graphql
cat operator/sources/controller/src/api/type-defs/*.graphql >> ./assets/schema.graphql

# Build API documentation from schema
npx spectaql ./assets/spectaql.yml -t static/api-doc
