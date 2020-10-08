# Kodi Twitch/Youtube Remote

A small React website for playing/controlling Twitch and Youtube videos on Kodi.
Runs locally, not on the Kodi device itself.

![Kodi-Remote](https://i.imgur.com/MYBK6Te.png)

## Installation/Usage

0. Install Kodi somewhere on the local network with the Twitch and Youtube plugins.

1. Set the following environment variables:
```
REACT_APP_TWITCH_ID=<your account's ID>
REACT_APP_TWITCH_CLIENT=<twitch api client>
REACT_APP_TWITCH_SECRET=<twitch api secret>
```

2. `npm install`

3. run `./copy.sh` to build the static HTML

4. `FLASK_APP=server/server.py flask run` to start the webserver

## Todo

* Twitch VOD support
* Youtube video scrub
* Display currently playing content (with appropriate controls?)