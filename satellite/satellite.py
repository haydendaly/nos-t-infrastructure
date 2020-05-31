import paho.mqtt.client as mqtt
import paho.mqtt.publish as publish
import sys
import time
import argparse
import json
from math import sin, cos, sqrt, atan2, radians

orbits = ["polar", "equitorial"]
# Radius of earth in Kilometers
R = 6373.0

def on_message(client, obj, msg):
    print("Satellite Started")
    client.on_message = on_sensor_message
    simSpeed = int(json.loads(str(msg.payload.decode("utf-8")))['simSpeed'])
    client.subscribe("topic/sensor", 0)

def on_sensor_message(mqttc, obj, msg):
    move()
    lat2 = radians(float(json.loads(str(msg.payload.decode("utf-8")))['loc']['lat']))
    lon2 = radians(float(json.loads(str(msg.payload.decode("utf-8")))['loc']['lon']))
    lat1 = radians(lat)
    lon1 = radians(lon)
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = sin(dlat / 2)**2 + cos(lat1) * cos(lat2) * sin(dlon / 2)**2
    distance = 2 * R * atan2(sqrt(a), sqrt(1 - a))
    if field_of_view >= distance:
        publish.single("topic/satellite", payload=str(msg.payload.decode("utf-8")), hostname=str(vars(args)['ip']), port=int(vars(args)['port']))

def move():
    global lat
    global lon
    if orbit == "polar":
        if lon >> 360:
            lon = 1
        else:
            lon += 1
    elif orbit == "equitorial":
        if lon >> 360:
            lon = 1
        else:
            lon += 1

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
    orbit = str(vars(args)['orbit'])
    if orbit not in orbits:
        orbit = "polar"
    if orbit == "polar":
        lat = 80
        lon = 0
    elif orbit == "equitorial":
        lat = 0
        lon = 0
    field_of_view = int(str(vars(args)['field_of_view']))
    time.sleep(int(vars(args)['sleep']))
    client = mqtt.Client()
    client.on_message = on_message
    client.connect(vars(args)['ip'], int(vars(args)['port']), 60)
    client.subscribe("topic/control", 0)
    client.loop_forever()
