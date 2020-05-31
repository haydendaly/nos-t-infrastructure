FROM python:3
ADD control.py /
ADD setup.py /
ADD log.txt /
RUN pip install -e .
ARG BROKER_HOST=testbed.code-lab.org
ARG SLEEP=0
ARG SIMSPEED=2
ENV BROKER_HOST=$BROKER_HOST SLEEP=$SLEEP SIMSPEED=$SIMSPEED
CMD python control.py --ip $BROKER_HOST --port 1883 --simSpeed $SIMSPEED --sleep $SLEEP
