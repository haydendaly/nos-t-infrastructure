FROM python:3
ADD . /
RUN pip install -e .
ARG BROKER_HOST=localhost
ARG SLEEP=0
ARG DATASET=arroyo
ENV BROKER_HOST=$BROKER_HOST SLEEP=$SLEEP DATASET=$DATASET
CMD python sensor.py --ip $BROKER_HOST --port 1883 --sleep $SLEEP --dataset $DATASET
