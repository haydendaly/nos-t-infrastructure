FROM node

WORKDIR /app
COPY /api/package.json /api/package.json
COPY api api

COPY DOCUMENTATION.md .
COPY README.md .
COPY TODO.md .
COPY doc_files doc_files

WORKDIR /app/api
RUN npm install
EXPOSE 3000
ARG BROKER_HOST=testbed.code-lab.org
ARG BROKER_PORT=1883
ENV BROKER_HOST=$BROKER_HOST BROKER_PORT=$BROKER_PORT
CMD [ "npm", "start" ]
