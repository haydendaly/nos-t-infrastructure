FROM node:alpine
ADD . /
RUN npm install
ARG BROKER_HOST=testbed.code-lab.org
ENV BROKER_HOST=$BROKER_HOST SLEEP=$SLEEP
CMD node index.js --ip $BROKER_HOST --port 1883 --sleep $SLEEP