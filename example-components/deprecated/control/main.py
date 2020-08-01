"""
Component that starts and stops the simulation. Logs all communications over 'topic/*'.
"""
import time
import argparse
import json
import io
import random
import paho.mqtt.client as mqtt
from flask import Flask, send_file, Response
from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas
from matplotlib.figure import Figure

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
    global init
    init = []
    """Starts the simulation by sending out initial parameters to all components and clears logs"""
    # clearing logs
    clear()

    # starting simulation
    message = {
        "name" : "control",
        "description" : "Starts and stops the simulation. Logs all communications over 'topic/*'.",
        "properties" : {
            "type" : "start",
            "simSpeed": str(simSpeed)
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
        "name" : "control",
        "description" : "Starts and stops the simulation. Logs all communications over 'topic/*'.",
        "properties" : {
            "type" : "stop",
        }
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
def not_found(error):
    """Return error message to site"""
    return error

# !!! Decentralize
@app.route('/plot.png')
def plot_png():
    fig = create_figure()
    output = io.BytesIO()
    FigureCanvas(fig).print_png(output)
    return Response(output.getvalue(), mimetype='image/png')

def create_figure():
    fig = Figure()
    axis = fig.add_subplot(1, 1, 1)
    xs = range(100)
    ys = [random.randint(1, 50) for x in xs]
    axis.plot(xs, ys)
    return fig


def on_message(mqttc, obj, msg):
    """Logs all communications on '/topic' to the log file"""
    time_stamp = time.gmtime()
    msg = time.strftime("%Y-%m-%d %H:%M:%S", time_stamp) + " " + \
        str(msg.topic) + ": " + str(msg.payload.decode("utf-8")) + "\n"
    with open("log.txt", "a") as file:
        file.write(msg)
    file.close()
    # !!! Local DB for logs

    if msg.topic == 'topic/init':
        global init
        init.append(json.loads(msg.payload.decode("utf-8")))


if __name__ == "__main__":
    # Dealing with command inputs
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
    inputs = vars(args)
    time.sleep(int(inputs['sleep']))

    # Setting up component info
    init = []

    # Connecting to the Solace client
    client = mqtt.Client()
    client.connect(inputs['ip'], int(inputs['port']))
    simSpeed = str(inputs['simSpeed'])
    client.on_message = on_message
    client.subscribe("topic/#", 0)
    client.loop_start()
    print("Ready:", str(inputs['ip']) + " " + str(inputs['port']))

    # Starting the Flask application
    app.run(host='0.0.0.0', port=5000, debug=False)
