const express = require('express');

module.exports.initExpressServer = function initExpressServer() {
  const app = express();
  app.get('/', (req, res) => res.send('Hello World!'));

  app.listen(3000, () => console.log('Express app start on port 3000!'));
};

// function getExpressFileLink() {}
