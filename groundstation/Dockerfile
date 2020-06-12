FROM python:3
ADD main.py /
ADD setup.py /
RUN pip install -e .
ARG BROKER_HOST=localhost
ENV BROKER_HOST=$BROKER_HOST SLEEP=$SLEEP
CMD python main.py --ip $BROKER_HOST --port 1883 --sleep $SLEEP
