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

TV_STATE = os.environ.get('TV_STATE')
if TV_STATE is None:
    TV_STATE = 'off'

@app.route('/kodi/<path:kodi_path>', methods=['POST'])
def proxy_kodi(kodi_path):
    full_url = KODI_URL + '/' + kodi_path
    r = requests.post(full_url, json=request.get_json())
    print(r.text)
    return r.text, r.status_code

@app.route('/api/tv/<string:state>')
def tv_power(state):
    global TV_STATE
    if state == 'on':
        tv_on()
    elif state == 'off':
        tv_off()
    elif state == 'toggle':
        if TV_STATE == 'on':
            TV_STATE = 'off'
            tv_off()
        elif TV_STATE == 'off':
            TV_STATE = 'on'
            tv_on()
    return ''

@app.route('/')
def index():
    return render_template('index.html')


def tv_on():
    wakeonlan.send_magic_packet(TV_MAC)
def tv_off():
    ws = LGTVRemote('lgtv', ip=TV_IP, mac=TV_MAC, key=TV_KEY, hostname=TV_HOSTNAME)
    ws.connect()
    ws.execute('off', {})
    ws.run_forever()
