#!/bin/bash
set -e

helm3 template -n anglo-self-service  --namespace app-anglo --values values.yaml ./ \
  --set web-public.image.tag=$CI_COMMIT_SHA \
  --set web-public.imageCredentials.username=$GITLAB_REGISTRY_USER \
  --set web-public.imageCredentials.password=$GITLAB_REGISTRY_TOKEN \
  $@