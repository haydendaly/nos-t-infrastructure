const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
// const http = require('http');
// const WebSocket = require('ws');

const indexRouter = require('./routes/index');
const resourceRouter = require('./routes/resource');
const downloadRouter = require('./routes/download');
const { initDb } = require('./functions/db');
const { initClient } = require('./functions/client');
// const { wsHandler } = require('./functions/websockets');

const app = express();

const host = process.env.BROKER_HOST ? process.env.BROKER_HOST : 'testbed.code-lab.org';
const port = process.env.BROKER_PORT ? process.env.BROKER_PORT : 1883;

console.log(host, port)

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/resource', resourceRouter);
app.use('/download', downloadRouter);
app.use((req, res) => {
  res.status(404).end({ message: "Invalid route" });
});

initDb(err => {
  if (err) {
    throw err;
  };
});

initClient(host, port, err => {
  if (err) {
    throw err;
  };
});

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
});

process.on('SIGINT', () => {
  // downloadLogs(() => process.exit(0));
  console.log('Exiting!');
  process.exit(0);
});

// Establish Websocket Tunneling
// const server = http.createServer(app);
// const wss = new WebSocket.Server({ server });
// wss.on('connection', ws => wsHandler('testbed.code-lab.org', 1883, ws));

// server.listen(2000, () => {
//   console.log('Websocket initialized');
// });

module.exports = app;