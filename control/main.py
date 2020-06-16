"""
Component that starts and stops the simulation. Logs all communications over 'topic/*'.
"""
import time
import argparse
import json
import paho.mqtt.client as mqtt
from flask import Flask, send_file

app = Flask(__name__, static_url_path='')


@app.route('/')
def root():
    """Returns the index of the site"""
    # !!! add static directory to serve files / look at app.py for CVIS
    return send_file('index.html')


@app.route('/log')
def log():
    """Returns the raw log file"""
    return send_file('log.txt')


@app.route('/start')
def start():
    """Starts the simulation by sending out initial parameters to all components and clears logs"""
    # clearing logs
    clear()

    # starting simulation
    message = {
        "name" : "control",
        "description" : "Starts and stops the simulation. Logs all communications over 'topic/*'.",
        "properties" : {
            "type" : "start",
            "sim_speed": str(SIM_SPEED)
        }
    }
    infot = client.publish("topic/control", json.dumps(message))
    infot.wait_for_publish()
    print("Simulation Started...")
    return "True"

@app.route('/stop')
def stop():
    """Stops the simulation by sending out message to all components"""
    message = {
        "type": "stop"
    }
    infot = client.publish("topic/control", json.dumps(message))
    infot.wait_for_publish()
    print("Simulation Stopped...")
    return "True"

@app.route('/clear')
def clear():
    """Opens and clears the log file"""
    open('log.txt', 'w').close()
    return "True"


@app.errorhandler(404)
def not_founnd(error):
    """Return error message to site"""
    return error


def on_message(mqttc, obj, msg):
    """Logs all communications on '/topic' to the log file"""
    time_stamp = time.gmtime()
    msg = time.strftime("%Y-%m-%d %H:%M:%S", time_stamp) + " " + \
        str(msg.topic) + ": " + str(msg.payload.decode("utf-8")) + "\n"
    with open("log.txt", "a") as file:
        file.write(msg)
    file.close()


if __name__ == "__main__":
    # Dealing with command inputs
    parser = argparse.ArgumentParser()
    parser.add_argument("--ip", default=argparse.SUPPRESS,
                        help="IP of (Docker) machine")
    parser.add_argument("--port", default=argparse.SUPPRESS,
                        help="Port of (Docker) machine")
    parser.add_argument("--sim_speed", default=argparse.SUPPRESS,
                        help="Speed of simulation")
    parser.add_argument("--sleep", default=argparse.SUPPRESS,
                        help="Sleep before starting simulation")
    args, leftovers = parser.parse_known_args()
    inputs = vars(args)
    time.sleep(int(inputs['sleep']))

    # Connecting to the Solace client
    client = mqtt.Client()
    client.connect(inputs['ip'], int(inputs['port']))
    SIM_SPEED = str(inputs['sim_speed'])
    client.on_message = on_message
    client.subscribe("topic/#", 0)
    client.loop_start()
    print("Ready:", str(inputs['ip']) + " " + str(inputs['port']))

    # Starting the Flask application
    app.run(host='0.0.0.0', port=5000, debug=False)
