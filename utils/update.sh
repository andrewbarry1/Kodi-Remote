#!/bin/bash
sudo service remote stop
git -C Kodi-Remote/ pull origin
./copy.sh
sudo service remote start
echo Restarted site.
