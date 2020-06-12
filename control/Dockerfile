FROM python:3
ADD main.py /
ADD setup.py /
ADD log.txt /
ADD index.html /
RUN pip install -e .
ARG BROKER_HOST=testbed.code-lab.org
ARG SLEEP=0
ARG SIMSPEED=2
ENV BROKER_HOST=$BROKER_HOST SLEEP=$SLEEP SIMSPEED=$SIMSPEED
CMD python main.py --ip $BROKER_HOST --port 1883 --sim_speed $SIMSPEED --sleep $SLEEP
