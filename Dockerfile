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
CMD [ "npm", "start" ]
