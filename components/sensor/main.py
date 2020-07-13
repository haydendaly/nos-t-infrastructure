"""
Model simulating streamflow data for a USGS sensor in California.
Supported datasets include:
    - arroyo
    - hansen
    - sepulveda
    - valyermo
"""
import time
import argparse
import json
import paho.mqtt.client as mqtt
import paho.mqtt.publish as publish
import pandas as pd

SUPPORTED_DATASETS = {
    "arroyo": "8278",
    "hansen": "8275",
    "sepulveda": "8265",
    "valyermo": "7332"
}


def on_message(mqttc, obj, msg):
    """Waits for message from control to start or stop"""
    global START

    if msg.topic == "topic/control":
        if json.loads(msg.payload.decode("utf-8"))["properties"]["type"] == "start":
            print("Sensor Started")
            global simSpeed
            simSpeed = int(json.loads(str(msg.payload.decode("utf-8")))["properties"]["simSpeed"])
            START = True

        elif json.loads(msg.payload.decode("utf-8"))["properties"]["type"] == "stop":
            print("Sensor Stopped")
            START = False


def control(ip, port, sleep, dataset, lat, lon):
    """Conencts to Solace client and prepares dataframe for simulation"""
    # Waiting for Pubsub container to start
    time.sleep(int(sleep))

    # Preparing dataframe for simulation
    if dataset not in SUPPORTED_DATASETS:
        dataset = "arroyo"
    data = pd.read_csv('datasets/' + dataset + '.csv', index_col=2, sep='\t')
    for col in data.columns:
        if SUPPORTED_DATASETS[dataset] in col and 'cd' in col:
            data.rename(columns={col: 'qualification'}, inplace=True)
        elif SUPPORTED_DATASETS[dataset] in col:
            data.rename(columns={col: 'discharge (ft^3/s)'}, inplace=True)

    # Connecting to client
    client = mqtt.Client()
    client.on_message = on_message
    client.connect(ip, int(port), 60)
    client.subscribe("topic/#", 0)
    client.loop_start()

    # Goes into loop waiting for control and then when true, begins to send messages
    while True:
        global START
        if START:
            for index, row in data.iterrows():
                if not START:
                    break
                global simSpeed
                time.sleep(simSpeed)
                message = {
                    "name": "sensor_" + vars(args)['dataset'],
                    "description" : "Model simulating streamflow data for a USGS sensor in " +
                                    dataset +
                                    ", California.",
                    "observation_type" : "Streamflow",
                    "unit_of_measurement" : "ft^3/s",
                    "result_time" : str(index),
                    "properties" : {
                        "observation" : str(row['discharge (ft^3/s)']),
                        "qualification" : row['qualification'],
                    },
                    "location": {
                        "latitude": lat,
                        "longitude": lon
                    }
                }
                infot = client.publish(
                    "topic/sensor", json.dumps(message), qos=2)
                infot.wait_for_publish()

def init(args):
    # Sends init info to control
    message = {
        "name": "sensor_" + vars(args)['dataset'],
        "description" : "Model simulating streamflow data for a USGS sensor in " +
                        vars(args)['dataset'] +
                        ", California.",
        "properties" : {
            "resources" : {},
            "subscriptions" : [
                "topic/control"
            ],
            "type" : "sensor"
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
                        help="Sleep before start")
    parser.add_argument("--dataset", default=argparse.SUPPRESS,
                        help="Dataset used for emulation")
    parser.add_argument("--lat", default=argparse.SUPPRESS,
                        help="Latitude of sensor")
    parser.add_argument("--lon", default=argparse.SUPPRESS,
                        help="Longitude of sensor")

    START = False
    simSpeed = 1
    args, leftovers = parser.parse_known_args()
    init(args)
    control(**vars(args))
