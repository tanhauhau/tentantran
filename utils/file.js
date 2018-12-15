const express = require('express');
const fetch = require('node-fetch');
const fs = require('fs');
const crypto = require('crypto');

const path = require('path');

const PORT = 3000;
const HOST = process.env.HOST || 'localhost';

module.exports.initExpressServer = function initExpressServer() {
  const app = express();
  app.get('/', (req, res) => res.send('Hello World!'));
  app.use('/static', express.static(path.join(__dirname, '../images')));
  app.listen(PORT, () => console.log(`Express app start on ${HOST}:${PORT}!`));
};

module.exports.getExpressFileLink = function getExpressFileLink(telegramUrl) {
  return fetch(telegramUrl).then((res) => {
    const filename = crypto
      .createHash('md5')
      .update(telegramUrl)
      .digest('hex');
    const dest = fs.createWriteStream(path.join(__dirname, '../images', `${filename}.png`));
    return new Promise((resolve) => {
      res.body.pipe(dest).on('finish', () => {
        resolve(`http://${HOST}:${PORT}/static/${filename}.png`);
      });
    });
  });
};
