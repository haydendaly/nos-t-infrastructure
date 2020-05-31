FROM python:3
ADD satellite.py /
ADD setup.py /
RUN pip install -e .
ARG BROKER_HOST=testbed.code-lab.org
ARG SLEEP=0
ARG ORBIT=polar
ARG FIELD_OF_VIEW=200
ENV BROKER_HOST=$BROKER_HOST SLEEP=$SLEEP ORBIT=$ORBIT FIELD_OF_VIEW=$FIELD_OF_VIEW
CMD python satellite.py --ip $BROKER_HOST --port 1883 --sleep $SLEEP --orbit $ORBIT --field_of_view $FIELD_OF_VIEW
