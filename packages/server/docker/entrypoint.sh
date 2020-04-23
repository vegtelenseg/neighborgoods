#!/bin/sh
set -e

# Always run in UTC
export TZ=utc

if [ $# -lt 1 ]
then
  echo "Usage : server|worker|migrate|rollback|seed|clean"
  exit
fi

case "$1" in

server)  echo "Starting server"
    node ./src/server/express.js
    ;;
worker)  echo  "Starting worker"
    node ./src/server/bull.js
    ;;
migrate)  echo  "Running knex migrations"
    node ./node_modules/knex/bin/cli.js migrate:latest
    ;;
seed) echo  "Running knex seed"
   node ./node_modules/knex/bin/cli.js seed:run
   ;;
rollback) echo  "Running knex rollback"
   node ./node_modules/knex/bin/cli.js migrate:rollback
   ;;
rollback) echo  "Running clean"
   node ./src/server/clean.js
   ;;
*) echo "Invalid Command $1"
    exit -1
   ;;
esac