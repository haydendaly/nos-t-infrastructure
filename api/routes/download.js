const express = require('express');
const router = express.Router();
const fs = require('fs');
const archiver = require('archiver');
const _ = require('lodash');
const { downloadLogs } = require('../functions/db');
const { getDate } = require('../functions/download');

router.get('/', (req, res) => {
    const date = getDate();
    downloadLogs(download => {
        if (!download) {
            res.status(204).send({ message: "No logs yet" }); 
        } else {
            const archive = archiver('zip');
            archive.on('error', err => {
                throw err;
            });
            archive.pipe(res);
            archive.directory(`../logs/${date}`, false);
            archive.finalize();
        }
    });
});

module.exports = router;