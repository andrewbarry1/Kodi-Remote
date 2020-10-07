from flask import Flask, render_template, request
import requests

app = Flask(__name__)

KODI_URL = 'http://192.168.1.156:8080'

@app.route('/kodi/<path:kodi_path>', methods=['POST'])
def proxy_kodi(kodi_path):
    full_url = KODI_URL + '/' + kodi_path
    r = requests.post(full_url, json=request.get_json())
    print(r.text)
    return r.text, r.status_code

@app.route('/api/tv/<string:state>')
def tv_power(state):
    if state == 'on':
        pass # TODO wake on lan
    elif state == 'off':
        pass # TODO websocket api.... thanks LG...
    return ''

@app.route('/')
def index():
    return render_template('index.html')

