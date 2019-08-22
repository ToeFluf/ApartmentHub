#!/bin/sh

echo "Pulling from deploy"
git pull origin master
echo "Successfully pulled from git"
echo "Restarting node server"
node server.js
echo "Server restarted successfully"


