![Architecture Diagram](https://github.com/haydendaly/nos-t-infrastructure-alpha/blob/master/doc_files/arch.png)

## Simulation Architecture

This repo contains an initial infrastructure for orchestrating simulation components. This was a quick prototype to demonstrate functionality and is now deprecated.

There is an example simulation which consists of the following components.
1. The control module starts the simulation by publishing a message to all the other components to start up under the `topic/control`.
2. The ground sensors act as publishers using data from CSV files taken from the USGS website publishing data to `topic/sensors` on an interval as determined by the control module.
3. The satellite listens to the sensor topic and repeats the data to `topic/satellite`.
4. The groundstation acts as a subscriber to `topic/satellite` and prints the data to the console.

To interact with the system, go to `localhost` in the browser and you will be presented with a dashboard.

#### Prerequisites

The only prerequisite is having Docker installed on your system.

#### Usage

To start the example simulation, run the following command.

```console
$ docker-compose -f docker-compose.example.yml up
```

To start the simulation, run the following command.

```console
$ /bin/bash init.sh
$ docker-compose up
```

The first command clones all the repositories listed in `init.sh` into the folder components. After running, it is good practice to run the following command to negate cached data.

```console
$ docker-compose down
```

And this command for the same reason regarding the example simulation.

```console
$ docker-compose -f docker-compose.example.yml down
```

#### Questions?
Direct any questions to hcd36@cornell.edu
