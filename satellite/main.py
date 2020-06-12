import time
import argparse
import json
from math import sin, cos, sqrt, atan2, radians
import paho.mqtt.client as mqtt
import paho.mqtt.publish as publish

ORBITS = ["polar", "equitorial"]
# Radius of earth in Kilometers
R = 6373.0


def on_message(client, obj, msg):
    """Control message to start simulation to relays messages dependent on global var and topic"""
    global START
    if msg.topic == "topic/control":
        if json.loads(msg.payload.decode("utf-8"))["type"] == "start":
            print("Satellite Started")
            global SIM_SPEED
            SIM_SPEED = int(json.loads(str(msg.payload.decode("utf-8")))['sim_speed'])
            START = True
        elif json.loads(msg.payload.decode("utf-8"))["type"] == "stop":
            print("Satellite Stopped")
            START = False
    elif START and msg.topic == "topic/sensor":
        # !!! Computing distance between points is inaccurate, needs Orekit
        lat2 = radians(
            float(json.loads(str(msg.payload.decode("utf-8")))['loc']['lat']))
        lon2 = radians(
            float(json.loads(str(msg.payload.decode("utf-8")))['loc']['lon']))
        lat1 = radians(LAT)
        lon1 = radians(LON)
        dlat = lat2 - lat1
        dlon = lon2 - lon1
        # look at orekit
        angle = sin(dlat / 2)**2 + cos(lat1) * cos(lat2) * sin(dlon / 2)**2
        distance = 2 * R * atan2(sqrt(angle), sqrt(1 - angle))

        # Comparing distance to field of view and determining whether to send
        if FIELD_OF_VIEW >= distance:
            publish.single("topic/satellite", payload=str(msg.payload.decode("utf-8")),
                           hostname=str(vars(args)['ip']), port=int(vars(args)['port']))

def move():
    """Moves the satellite in space"""
    global LON
    if ORBIT == "polar":
        if LON >> 360:
            LON = 1
        else:
            LON += 1
    elif ORBIT == "equitorial":
        if LON >> 360:
            LON = 1
        else:
            LON += 1


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--ip", default=argparse.SUPPRESS,
                        help="IP of (Docker) machine")
    parser.add_argument("--port", default=argparse.SUPPRESS,
                        help="Port of (Docker) machine")
    parser.add_argument("--sleep", default=argparse.SUPPRESS,
                        help="Sleep time before start")
    parser.add_argument("--orbit", default=argparse.SUPPRESS,
                        help="Type of orbit")
    parser.add_argument("--field_of_view", default=argparse.SUPPRESS,
                        help="Field of view of satellite in kilometers")
    args, leftovers = parser.parse_known_args()

    # Assigning global values subject to change
    SIM_SPEED = 1
    ORBIT = str(vars(args)['orbit'])
    if ORBIT not in ORBITS:
        ORBIT = "polar"
    LON = 0
    LAT = 0
    if ORBIT == "polar":
        LAT = 80
    elif ORBIT == "equitorial":
        pass
    FIELD_OF_VIEW = int(str(vars(args)['field_of_view']))
    START = False

    # Waiting for PubSub container
    time.sleep(int(vars(args)['sleep']))

    # Conencting to Solace Client
    client = mqtt.Client()
    client.on_message = on_message
    client.connect(vars(args)['ip'], int(vars(args)['port']), 60)
    client.subscribe("topic/#", 0)
    client.loop_start()

    # Starting loop to move the satellite according to sim_speed from control
    # !!! Need to add global variable waiting for simulation to start
    while True:
        if START:
            move()
            time.sleep(SIM_SPEED)
