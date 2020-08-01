FROM python:3
ADD main.py /
ADD setup.py /
RUN pip install -e .
ARG BROKER_HOST=testbed.code-lab.org
ENV BROKER_HOST=$BROKER_HOST SLEEP=$SLEEP
CMD python main.py --ip $BROKER_HOST --port 1883 --sleep $SLEEP
