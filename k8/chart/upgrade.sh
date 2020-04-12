#!/bin/sh
set -e

: ${GITLAB_REGISTRY_USER?GITLAB_REGISTRY_USER is Required}
: ${GITLAB_REGISTRY_TOKEN?GITLAB_REGISTRY_TOKEN is Required}
: ${CI_COMMIT_SHA?CI_COMMIT_SHA is Required}

# : ${OAUTH_GITLAB_REGISTRY_USER?OAUTH_GITLAB_REGISTRY_USER is Required}
# : ${OAUTH_GITLAB_REGISTRY_TOKEN?OAUTH_GITLAB_REGISTRY_TOKEN is Required}

helm upgrade anglo-self-service --install \
  --namespace app-anglo --values values.yaml ./ \
  --set web-public.image.tag=$CI_COMMIT_SHA \
  --set web-public.imageCredentials.username=$GITLAB_REGISTRY_USER \
  --set web-public.imageCredentials.password=$GITLAB_REGISTRY_TOKEN \
  --set web-server.image.tag=$CI_COMMIT_SHA \
  --set web-server.imageCredentials.username=$GITLAB_REGISTRY_USER \
  --set web-server.imageCredentials.password=$GITLAB_REGISTRY_TOKEN \
  $@