from flask import Flask, render_template, request
import requests
import wakeonlan

app = Flask(__name__)

KODI_URL = 'http://192.168.1.156:8080'
TV_MAC = 'A8.23.FE.4C.43.A1'

@app.route('/kodi/<path:kodi_path>', methods=['POST'])
def proxy_kodi(kodi_path):
    full_url = KODI_URL + '/' + kodi_path
    r = requests.post(full_url, json=request.get_json())
    print(r.text)
    return r.text, r.status_code

@app.route('/api/tv/<string:state>')
def tv_power(state):
    if state == 'on':
        wakeonlan.send_magic_packet(TV_MAC)
    elif state == 'off':
        pass # TODO websocket api.... thanks LG...
    return ''

@app.route('/')
def index():
    return render_template('index.html')

