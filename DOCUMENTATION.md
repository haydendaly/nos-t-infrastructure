## Schema

This is basic documentation specifying the component communication in greater depth than the `README.md` goes into.

### System Architecture

The structure of this sounds complicated at first because implementation of tools like Docker, Nginx, React, Express, Solace, MQTT, etc. but is relatively straight forward in terms of core functionality. Provided below is a rough diagram showing the communication between components.

![Architecture Diagram](./doc_files/arch.png)

There are four primary components in the system as pictured above. The data is being ignored as a component because it is built into the current sensor component. All components are in communication through MQTT with Solace as the broker. I'll go through each of the components and their behavior and composition.

#### Control

This acts as a user interface for the simulation and simply sends messages via MQTT over `topic/control` to the rest of the components within the system. This also listens to messages on any topic of the format `topic/*` and provides a log of them which can be accessed on the UI.

The UI is React compiled through Webpack and then a reverse proxy with Nginx which allows for the user interface on `http://localhost` to interact with the entire system.

#### API

This acts as a developer interface for the simulation and the Control just provides an interface for its functionality. It is in the form of a REST API built upon Express. A mapping of the API's endpoints and data schema is in the process of be written but can be accessed through `http://localhost/api`.

The API provides logging for the entire simulation and will export a `CSV, XLSX, and JSON` file of all logs upon shutting down. This will be availible in the logs folder (Only internal as of now).

The API also has a Websocket interface for subscribing to the data stream of communication availible on `http://localhost/ws` (Only availible internally as of now).

#### Sensor

This is a relatively simple model of a ground sensor which takes the input of which dataset to operate off of from the four options provided below. There is only one model for sensors and it is just reused varying the dataset and location. The particularly model uses streamflow data from the USGS website in the form of a `CSV` file. It outputs its data out according to the simulation speed as specified by the control.

#### Satellite

This component models simple orbits of a satellite listening to data from the sensors. It does a very basic calculation to detect whether the latitude/longitude of the sensor is within range of the satellite and relays the data to the groundstations if so. The satellite propogates according to initial position and the choice of either a polar or equitorial orbit. The speed of the propagation is determined by the simulation speed received from control.

#### Groundstation

This is the simplest component in the system and just listens to satellites regardless of location. It relays any received data over `topic/groundstation` to be reflected in the simulation logs.

### Schema

The schema for communication between the components is loosely based off the SensorThings API which can be read more about here: https://en.wikipedia.org/wiki/SensorThings_API. There are four types of communications and i'll go through each of the ones i'm currently using. These are not final and i'm very open to suggestions. The general schema will consist of the fields `name, description, and properties` which are the basic attributes of any "thing" within our system.

#### Control

##### Example Data:

```json
{
    "name" : "control",
    "description" : "Starts and stops the simulation. Logs all communications over 'topic/*'.",
    "properties" : 	{
        "type": "start",
        "startTime": "2020-08-01T21:06:48.050Z",
        "simStartTime": "2020-08-01T21:06:48.050Z",
        "timeScalingFactor": 600,
        "simStopTime": "2020-08-02T07:06:48.050Z"
    }
}
```

This example is for the start message and to stop the system, a similar message with the `type: "stop"` and just a `stopTime` field in ISO 8601 format will stop the system. If fields aren't provided in the control dashboard, the `startTime` will be defaulted to 30 seconds in the future, `simStartTime` will be defaulted to one week in the past `simStopTime` will be defaulted to 6 days in the past, and `timeScaling` will be defaulted to 144.

#### Sensor

##### Example Data:

```json
{
    "name": "sensor_8278",
    "description" : "Model simulating streamflow data for a USGS sensor in Arroyo, California.",
    "observation_type" : "Streamflow",
    "unit_of_measurement" : "ft^3/s",
    "result_time" : "2019-05-30",
    "properties" : {
        "observation" : "4.37",
        "qualification" : "A",
    },
    "location": {
        "latitude": 0,
        "longitude": 80
    }
}
```

This is pulling the observation from the datasets CSV files row by row. Some important fields are the `observation_type, unit_of_measurement, result_time, and properties.qualification` which specify the context of the observation similar to the sensor model on the SensorThings API.

#### Satellite

##### Example Data:

```json
{
    "name" : "satellite_polar",
    "description" : "Model simulating satellite in polar orbit.",
    "properties" : {
        "relayed_observation" : "4.37",
        "observation_origin" : "sensor_8278"
    },
    "location": {
        "latitude": 0,
        "longitude": 80
    }
}
```

This is a pretty simple one as it just outputs location and info regarding a relayed communication from `topic/sensor`.

#### Groundstation

##### Example Data:

```json
{
    "name" : "groundstation",
    "description" : "Model simulating groundstation connected to all satellites.",
    "properties" : {
        "relayed_observation" : "4.37",
        "observation_origin" : "sensor_8278",
        "message_source" : "satellite_polar"
    }
}
```

This is simple as well as it just relays an observation providing context.


