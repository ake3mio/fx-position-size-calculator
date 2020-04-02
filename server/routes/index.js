const express = require('express');
const router = express.Router();
const packageJson = require('../../package');

router.get('/', function(req, res) {
  res.json({
    'name': 'position-size-calculator',
    'version': packageJson.version
  });
});

module.exports = router;
