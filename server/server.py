from flask import Flask, render_template, request
from LGTV import LGTVRemote
import requests
import wakeonlan
import os


app = Flask(__name__)

KODI_URL = 'http://192.168.1.156:8080'

TV_MAC = 'A8.23.FE.4C.43.A1'
TV_IP = '192.168.1.158'
TV_KEY = '6e0fd779fc6d7dfaa6c1802a64ced21f'
TV_HOSTNAME = 'LGwebOSTV'

TV_ON = False

@app.route('/kodi/<path:kodi_path>', methods=['POST'])
def proxy_kodi(kodi_path):
    global TV_ON
    full_url = KODI_URL + '/' + kodi_path
    json = request.get_json()
    if json['method'] == 'Player.Open' and not TV_ON:
        tv_on()
    r = requests.post(full_url, json=json)
    return r.text, r.status_code

@app.route('/api/tv/<string:state>')
def tv_power(state):
    global TV_ON
    if state == 'on':
        tv_on()
    elif state == 'off':
        tv_off()
    elif state == 'toggle':
        if TV_ON:
            tv_off()
        else:
            tv_on()
    return ''

@app.route('/')
def index():
    return render_template('index.html')


def tv_on():
    global TV_ON
    TV_ON = True
    wakeonlan.send_magic_packet(TV_MAC)
def tv_off():
    global TV_ON
    TV_ON = False
    ws = LGTVRemote('lgtv', ip=TV_IP, mac=TV_MAC, key=TV_KEY, hostname=TV_HOSTNAME)
    ws.connect()
    ws.execute('off', {})
    ws.run_forever()
