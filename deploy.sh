#!/usr/bin/env bash

git clone -b deploy --single-branch https://github.com/ToeFluf/ApartmentHub.git
echo "Starting node server"
node server.js
