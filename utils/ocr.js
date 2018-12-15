const fetch = require('node-fetch');

module.exports = function(imageUri) {
  return fetch(
    `https://vision.googleapis.com/v1/images:annotate?key=${
      process.env.GOOGLE_API_KEY
    }`,
    {
      method: 'POST',
      body: JSON.stringify({
        requests: [
          {
            image: {
              source: {
                imageUri
              }
            },
            features: [
              {
                type: 'TEXT_DETECTION'
              }
            ]
          }
        ]
      })
    }
  )
    .then(res => res.json())
    .then(res => res.responses[0].fullTextAnnotation.text)
    .catch(_ => '');
};
