#!/usr/bin/env bash

images=$(docker images | grep "<none>" | awk 'NR >=1 {print $3}')
docker rmi -f $images