const express = require('express');
const onHeaders = require('on-headers');
const _ = require('lodash');
const { getLogs, getComponents } = require('../functions/db');
const { toggle } = require('../functions/client');
const router = express.Router();

function scrubETag(res) {
  onHeaders(res, function () {
    this.removeHeader('ETag')
  })
};

router.get('/logs', (req, res) => {
  if (_.has(req.query, 'init')) {
    scrubETag(res);
  }
  getLogs(data => res.send(data));
});

router.get('/components', (req, res) => {
  scrubETag(res);
  getComponents(data => res.send(data));
});

router.post('/start', (req, res) => {
  toggle('start', { simSpeed: 1, ...req.body }, data => res.send(data));
});

router.post('/stop', (req, res) => {
  toggle('stop', req.body, data => res.send(data));
});

module.exports = router;