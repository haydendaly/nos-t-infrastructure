FROM python:3
ADD main.py /
ADD setup.py /
ADD log.txt /
ADD index.html /
RUN pip install -e .
ARG BROKER_HOST=testbed.code-lab.org
ARG SLEEP=0
ARG timeScalingFactor=2
ENV BROKER_HOST=$BROKER_HOST SLEEP=$SLEEP timeScalingFactor=$timeScalingFactor
CMD python main.py --ip $BROKER_HOST --port 1883 --timeScalingFactor $timeScalingFactor --sleep $SLEEP
