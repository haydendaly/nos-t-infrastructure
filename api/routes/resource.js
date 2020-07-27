const express = require('express');
const router = express.Router();
const fs = require('fs');
const _ = require('lodash');

const files = {
  DOCUMENTATION: '../DOCUMENTATION.md',
  README: '../README.md',
  TODO: '../TODO.md',
  arch: '../doc_files/arch.png'
};

const resourceMapping = {
  './doc_files/arch.png': 'RESOURCE_URL/resource/arch'
}

router.get('/:filename', (req, res) => {
  const filename = _.get(req.params, 'filename');
  const resourceURL = _.get(files, filename);
  if (resourceURL) {
    if (resourceURL.includes('.md')) {
      fs.readFile(resourceURL, 'utf8', (err, data) => {
        let response = data;
        Object.keys(resourceMapping).forEach(key => {
          response = data.replace(key, resourceMapping[key]);
        });
        res.send(response);
      });
    } else if (resourceURL.includes('.png')) {
      const s = fs.createReadStream(resourceURL);
      s.on('open', () => {
        res.set('Content-Type', 'image/png');
        s.pipe(res);
      });
      s.on('error', () => {
        res.set('Content-Type', 'text/plain');
        res.status(404).end({ message: `No resource named ${filename}` });
      })
    };
  } else {
    res.set('Content-Type', 'text/plain');
    res.status(404).end({ message: `No resource named ${filename}` });
  };
});

module.exports = router;