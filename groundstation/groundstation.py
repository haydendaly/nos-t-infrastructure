import paho.mqtt.client as mqtt
import sys
import time
import argparse
import json

def on_message(client, obj, msg):
    print("Ground Station Started")
    client.on_message = on_satellite_message
    client.subscribe("topic/satellite", 0)

def on_satellite_message(client, obj, msg):
    print(str(msg.payload.decode("utf-8")))

def control(ip, port, sleep):
    time.sleep(int(sleep))
    client = mqtt.Client()
    client.on_message = on_message
    client.connect(ip, int(port), 60)
    client.subscribe("topic/control", 0)
    client.loop_forever()

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--ip", default=argparse.SUPPRESS,
                        help="IP of (Docker) machine")
    parser.add_argument("--port", default=argparse.SUPPRESS,
                        help="Port of (Docker) machine")
    parser.add_argument("--sleep", default=argparse.SUPPRESS,
                        help="Sleep time before start")
    args, leftovers = parser.parse_known_args()
    control(**vars(args))
