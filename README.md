## Simulation Architecture

This repo contains an initial infrastructure for orchestrating simulation components.

It consists of a control module, four ground sensors emulating water stream data in the Los Angeles area, a satellite, and a ground station.
1. The control module starts the simulation by publishing a message to all the other components to start up under the `topic/control`.
2. The ground sensors act as publishers using data from CSV files taken from the USGS website publishing data to `topic/sensors` on an interval as determined by the control module.
3. The satellite listens to the sensor topic and repeats the data to `topic/satellite`.
4. The groundstation acts as a subscriber to `topic/satellite` and prints the data to the console.

To interact with the system, go to `localhost` in the browser and you will be presented with a dashboard.

#### Prerequisites

The only prerequisite is having Docker installed on your system.

#### Usage

To start the simulation, run the following command.

```console
$ docker-compose up --build
```

#### Questions?
Direct any questions to hdaly1@stevens.edu
