import time
import argparse
import json
import paho.mqtt.client as mqtt
import pandas as pd

SUPPORTED_DATASETS = {
    "arroyo": "8278",
    "hansen": "8275",
    "sepulveda": "8265",
    "valyermo": "7332"
}


def on_message(client, obj, msg):
    """Waits for message from control to start component"""
    print("Sensor Started")
    global sim_speed
    sim_speed = int(json.loads(str(msg.payload.decode("utf-8")))['sim_speed'])
    global start
    start = True


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
    client.subscribe("topic/control", 0)
    client.loop_start()

    # Goes into loop waiting for control and then when true, begins to send messages
    while True:
        global start
        if start:
            for index, row in data.iterrows():
                global sim_speed
                time.sleep(sim_speed)
                message = {
                    "site_name": dataset,
                    "site_no": str(row['site_no']),
                    "timestamp": str(index),
                    "discharge": str(row['discharge (ft^3/s)']),
                    "qualification": row['qualification'],
                    "loc": {
                        "lat": lat,
                        "lon": lon
                    }
                }
                infot = client.publish(
                    "topic/sensor", json.dumps(message), qos=2)
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
    start = False
    sim_speed = 1
    args, leftovers = parser.parse_known_args()
    control(**vars(args))
