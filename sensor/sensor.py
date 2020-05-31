import paho.mqtt.client as mqtt
import sys
import time
import argparse
import json
import pandas as pd

start = False
simSpeed = 1

supported_datasets = {
    "arroyo" : "8278",
    "hansen" : "8275",
    "sepulveda" : "8265",
    "valyermo" : "7332"
}

def on_message(client, obj, msg):
    print("Sensor Started")
    global simSpeed
    simSpeed = int(json.loads(str(msg.payload.decode("utf-8")))['simSpeed'])
    global start
    start = True

def control(ip, port, sleep, dataset, lat, lon):
    time.sleep(int(sleep))
    client = mqtt.Client()
    client.on_message = on_message
    if dataset not in supported_datasets:
        dataset = "arroyo"
    df = pd.read_csv('datasets/' + dataset + '.csv', index_col=2, sep='\t')
    for col in df.columns:
        if supported_datasets[dataset] in col and 'cd' in col:
            df.rename(columns={col: 'qualification'}, inplace=True)
        elif supported_datasets[dataset] in col:
            df.rename(columns={col: 'discharge (ft^3/s)'}, inplace=True)

    client.connect(ip, int(port), 60)
    client.subscribe("topic/control", 0)
    client.loop_start()

    while True:
        global start
        if start:
            for index, row in df.iterrows():
                global simSpeed
                time.sleep(simSpeed)
                # print("Sending request {:s} …".format(str(index)))
                message = {
                    "site_name" : dataset,
                    "site_no" : str(row['site_no']),
                    "timestamp" : str(index),
                    "discharge" : str(row['discharge (ft^3/s)']),
                    "qualification" : row['qualification'],
                    "loc" : {
                        "lat" : lat,
                        "lon" : lon
                    }
                }
                infot = client.publish("topic/sensor", json.dumps(message), qos=2)
                infot.wait_for_publish()

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
    args, leftovers = parser.parse_known_args()
    control(**vars(args))
