import paho.mqtt.client as mqtt
import sys
import time
import argparse
import json
from flask import Flask, request, make_response, send_file, render_template

app = Flask(__name__, static_url_path='')

@app.route('/')
def root():
    return """
        <body>
           <h1>Testbed</h1>
        </body>
        <a href="/log"
            <button type="button">
                View Logs
            </button>
        </a>
    """

@app.route('/log')
def log():
    return send_file('log.txt')

@app.errorhandler(404)
def not_founnd(e):
    return e

def on_message(client, obj, msg):
    ts = time.gmtime()
    msg = time.strftime("%Y-%m-%d %H:%M:%S", ts) + " " + str(msg.topic) + ": " + str(msg.payload.decode("utf-8")) + "\n"
    with open("log.txt", "a") as f:
        f.write(msg)
    f.close()

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--ip", default=argparse.SUPPRESS,
                        help="IP of (Docker) machine")
    parser.add_argument("--port", default=argparse.SUPPRESS,
                        help="Port of (Docker) machine")
    parser.add_argument("--simSpeed", default=argparse.SUPPRESS,
                        help="Speed of simulation")
    parser.add_argument("--sleep", default=argparse.SUPPRESS,
                        help="Sleep before starting simulation")
    args, leftovers = parser.parse_known_args()
    time.sleep(int(vars(args)['sleep']))
    client = mqtt.Client()
    print("Starting simulation:", str(vars(args)['ip']) + " " + str(vars(args)['port']))
    client.connect(vars(args)['ip'], int(vars(args)['port']))
    message = {
        "simSpeed" : vars(args)['simSpeed']
    }
    infot = client.publish("topic/control", json.dumps(message))
    infot.wait_for_publish()
    print("Simulation Started...")
    client.on_message = on_message
    client.subscribe("topic/#", 0)
    client.loop_start()
    app.run(host='0.0.0.0', port=5000, debug=False)
