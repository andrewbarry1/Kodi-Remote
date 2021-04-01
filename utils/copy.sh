#!/bin/bash

npm run --prefix Kodi-Remote build
cp Kodi-Remote/build/index.html Kodi-Remote/server/templates/
cp -r Kodi-Remote/build/static/ Kodi-Remote/server/
