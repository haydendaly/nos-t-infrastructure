"""
Model simulating groundstation for collecting satellite data.
"""
import time
import argparse
import json
import paho.mqtt.client as mqtt
import paho.mqtt.publish as publish

START = False

def on_message(client, obj, msg):
    """Sets up message received callback for MQTT"""
    global START
    message_dict = json.loads(str(msg.payload.decode("utf-8")))
    if msg.topic == "topic/control":
        if message_dict["properties"]["type"] == "start":
            print("Ground Station Started")
            START = True

        elif message_dict["properties"]["type"] == "stop":
            print("Ground Station Stopped")
            START = False
    elif START and msg.topic == "topic/satellite":
        # preparing message
        message = {
            "name" : "groundstation",
            "description" : "Model simulating groundstation connected to all satellites.",
            "properties" : {
                "relayed_observation" : message_dict["properties"]["relayed_observation"],
                "observation_origin" : message_dict["properties"]["observation_origin"],
                "message_source" : message_dict["name"]
            }
        }
        publish.single("topic/groundstation", payload=json.dumps(message),
                       hostname=str(vars(args)['ip']), port=int(vars(args)['port']))

def control(ip, port, sleep):
    """Sets up MQTT subscription for simulation"""
    time.sleep(int(sleep))
    client = mqtt.Client()
    client.on_message = on_message
    client.connect(ip, int(port), 60)
    client.subscribe("topic/#", 0)
    client.loop_forever()

def init(args):
    # Sends init info to control
    message = {
        "name" : "groundstation",
        "description" : "Model simulating groundstation connected to all satellites.",
        "properties" : {
            "resources" : {}
        }
    }
    publish.single("topic/init", payload=json.dumps(message),
                    hostname=str(vars(args)['ip']), port=int(vars(args)['port']))

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--ip", default=argparse.SUPPRESS,
                        help="IP of (Docker) machine")
    parser.add_argument("--port", default=argparse.SUPPRESS,
                        help="Port of (Docker) machine")
    parser.add_argument("--sleep", default=argparse.SUPPRESS,
                        help="Sleep time before start")
    args, leftovers = parser.parse_known_args()
    init(args)
    
    control(**vars(args))
