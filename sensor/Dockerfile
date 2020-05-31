FROM python:3
ADD . /
RUN pip install -e .
ARG BROKER_HOST=testbed.code-lab.org
ARG SLEEP=0
ARG DATASET=arroyo
ARG LAT=80
ARG LON=0
ENV BROKER_HOST=$BROKER_HOST SLEEP=$SLEEP DATASET=$DATASET LAT=$LAT LON=$LON
CMD python sensor.py --ip $BROKER_HOST --port 1883 --sleep $SLEEP --dataset $DATASET --lat $LAT --lon $LON
