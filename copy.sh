#!/bin/bash

npm run build
cp build/index.html server/templates/
cp -r build/static/ server/
