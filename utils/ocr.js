const fetch = require('node-fetch');
const beautify = require('json-beautify');

function debug(imageUri, res) {
  try {
    console.log(imageUri);
    console.log(beautify(res, null, 2, 100));
    for (const response of res.responses) {
      console.log(response.fullTextAnnotation.text);
    }
    console.log();
  } catch (e) {
    // pass
  }
}

module.exports = imageUri => fetch(`https://vision.googleapis.com/v1/images:annotate?key=${process.env.GOOGLE_API_KEY}`, {
  method: 'POST',
  body: JSON.stringify({
    requests: [
      {
        image: {
          source: {
            imageUri,
          },
        },
        features: [
          {
            type: 'TEXT_DETECTION',
          },
        ],
      },
    ],
  }),
})
  .then(res => res.json())
  .then((res) => {
    debug(imageUri, res);
    return res;
  })
  .then(res => res.responses[0].fullTextAnnotation.text)
  .catch(() => '');
