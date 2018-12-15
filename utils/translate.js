const fetch = require('node-fetch');

module.exports = (text, toLang) => fetch(
  `https://translation.googleapis.com/language/translate/v2?key=${
    process.env.GOOGLE_TRNS_API
  }&q=${
    text
  }&target=${
    toLang
  }`,
  {
    method: 'POST',
  },
)
  .then(res => res.json())
  .then(res => res.data.translations)
  .catch(error => error);
