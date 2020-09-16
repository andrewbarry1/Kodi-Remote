# Kodi Twitch/Youtube Remote

A small React website for playing/controlling Twitch and Youtube videos on Kodi.
Runs locally, not on the Kodi device itself.

![Kodi-Remote](https://i.imgur.com/kHh1UVn.png)

## Installation/Usage

0. Install Kodi somewhere on the local network with the Twitch and Youtube plugins.

1. Set the following environment variables:
```
REACT_APP_TWITCH_ID=<your account's ID>
REACT_APP_TWITCH_CLIENT=<twitch api client>
REACT_APP_TWITCH_SECRET=<twitch api secret>
```
2. Set `proxy` in `package.json` to your Kodi URL

3. `npm install && npm start`

## Todo

* Youtube video pause/resume/scrub
* Twitch VOD support
* Youtube stream support
* Open popout Twitch chat
* Reload Twitch stream
