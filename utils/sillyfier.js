const Wordpos = require('wordpos');
const _ = require('lodash');
const fetch = require('node-fetch');
const { parse } = require('node-html-parser');

const wordpos = new Wordpos();

const sillyPlugins = [antonymify];

function findAdjectives(sentence) {
  return Promise.resolve(wordpos.getAdjectives(sentence));
}
function getAntonym(word) {
  return (
    fetch(`https://www.thesaurus.com/browse/${word}?s=ts`)
      .then(res => res.text())
      .then(html => parse(html)
        .querySelectorAll('.antonyms-container ul li span a')
        .map(node => node.text))
      .then((antonyms) => {
        if (antonyms.length > 0) {
          return _.sample(antonyms);
        }
        throw new Error();
      })
      .then(antonym => ({ from: word, to: antonym }))
      // if fail, as if replace to the same word
      .catch(() => ({ from: word, to: word }))
  );
}

function antonymify(sentence) {
  return findAdjectives(sentence)
    .then((adjectives) => {
      const sampleAdjectives = _.sampleSize(adjectives, _.random(adjectives.length));
      return Promise.all(sampleAdjectives.map(adjective => getAntonym(adjective)));
    })
    .then(replacers => replacers.reduce((result, replacer) => result.replace(replacer.from, replacer.to), sentence));
}

function sillyfier(sentence) {
  return sillyPlugins.reduce(
    (promise, fn) => promise.then(result => fn(result)),
    Promise.resolve(sentence),
  );
}

module.exports = sillyfier;
