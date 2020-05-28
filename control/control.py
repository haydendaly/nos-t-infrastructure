import paho.mqtt.client as mqtt
import sys
import time
import argparse
import json

def control(ip, port, simSpeed, sleep):
    time.sleep(int(sleep))
    client = mqtt.Client()
    print("Starting simulation:", str(ip) + " " + str(port))
    client.connect(ip, int(port))
    message = {
        "simSpeed" : simSpeed
    }
    infot = client.publish("topic/control", json.dumps(message))
    infot.wait_for_publish()
    print("Simulation Started...")

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
    control(**vars(args))
