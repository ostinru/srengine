#!/bin/bash

cd srening
git pull
npm install
NODE_PATH=. node etc/create_db.js
NODE_PATH=. node app.js

