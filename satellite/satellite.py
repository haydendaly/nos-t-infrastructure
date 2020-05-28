import paho.mqtt.client as mqtt
import paho.mqtt.publish as publish
import sys
import time
import argparse
import json

def on_message(client, obj, msg):
    print("Satellite Started")
    client.on_message = on_sensor_message
    client.subscribe("topic/sensor", 0)

def on_sensor_message(mqttc, obj, msg):
    # print("Satellite Recieved and Sent")
    publish.single("topic/satellite", payload=str(msg.payload.decode("utf-8")), hostname=str(vars(args)['ip']), port=int(vars(args)['port']))

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--ip", default=argparse.SUPPRESS,
                        help="IP of (Docker) machine")
    parser.add_argument("--port", default=argparse.SUPPRESS,
                        help="Port of (Docker) machine")
    parser.add_argument("--sleep", default=argparse.SUPPRESS,
                        help="Sleep time before start")
    args, leftovers = parser.parse_known_args()
    time.sleep(int(vars(args)['sleep']))
    client = mqtt.Client()
    client.on_message = on_message
    client.connect(vars(args)['ip'], int(vars(args)['port']), 60)
    client.subscribe("topic/control", 0)
    client.loop_forever()
