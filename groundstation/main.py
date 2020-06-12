import time
import argparse
import json
import paho.mqtt.client as mqtt

START = False

def on_message(client, obj, msg):
    """Sets up message received callback for MQTT"""
    global START
    if msg.topic == "topic/control":
        if json.loads(msg.payload.decode("utf-8"))["type"] == "start":
            print("Ground Station Started")
            START = True
        elif json.loads(msg.payload.decode("utf-8"))["type"] == "stop":
            print("Ground Station Stopped")
            START = False
    elif START and msg.topic == "topic/satellite":
        print(str(msg.payload.decode("utf-8")))

def control(ip, port, sleep):
    """Sets up MQTT subscription for simulation"""
    time.sleep(int(sleep))
    client = mqtt.Client()
    client.on_message = on_message
    client.connect(ip, int(port), 60)
    client.subscribe("topic/#", 0)
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
