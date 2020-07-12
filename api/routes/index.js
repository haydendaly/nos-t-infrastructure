const express = require('express');
const router = express.Router();
const _ = require('lodash');
const { getLogs, getComponents } = require('../functions/db');
const { toggle } = require('../functions/client');

router.get('/logs', (req, res) => {
  const after = _.get(req.query, 'after');
  getLogs(data => res.send(data), after);
});

router.get('/components', (req, res) => {
  getComponents(data => res.send(data));
});

router.post('/start', (req, res) => {
  toggle('start', { simSpeed: 1, ...req.body }, data => res.send(data));
});

router.post('/stop', (req, res) => {
  toggle('stop', req.body, data => res.send(data));
});

module.exports = router;