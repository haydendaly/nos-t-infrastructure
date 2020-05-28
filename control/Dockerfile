FROM python:3
ADD control.py /
ADD setup.py /
RUN pip install -e .
ARG BROKER_HOST=localhost
ENV BROKER_HOST=$BROKER_HOST SLEEP=$SLEEP
CMD python control.py --ip $BROKER_HOST --port 1883 --simSpeed 2 --sleep $SLEEP
