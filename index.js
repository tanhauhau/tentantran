require('dotenv').load();

// communicate with user
const Telegraf = require('telegraf');
// communicate with telegram server
const _ = require('lodash');
const Telegram = require('telegraf/telegram');
const { initExpressServer, getExpressFileLink } = require('./utils/file');
const ocr = require('./utils/ocr');
const translate = require('./utils/translate');
const sillyfier = require('./utils/sillyfier');
const languages = require('./utils/languages');
const replies = require('./utils/replies');
const timebombSetup = require('./utils/timebomb');

initExpressServer();

const tempBotToken = process.env.BOT_TOKEN;

console.log('telegram bot started');

let toggle = 1;

let bot;
let telegram;
if (tempBotToken) {
  bot = new Telegraf(tempBotToken);
  telegram = new Telegram(tempBotToken, []);
} else {
  bot = new Telegraf(process.env.BOT_TOKEN);
  telegram = new Telegram(process.env.BOT_TOKEN, []);
}

const delayTimebomb = timebombSetup(telegram);

bot.start(ctx => ctx.reply(
  'Hi! Ever felt translations were too good nowadays? Use me instead! Send me some images or text to translate!',
));
bot.help(ctx => ctx.reply('Send me some image or text to translate!'));
bot.on('message', (ctx) => {
  delayTimebomb(ctx.chat);

  if (Math.random() < toggle * 0.15) {
    ctx.reply(_.sample(replies.lazy));
    return;
  }

  let promise = Promise.resolve();

  if (ctx.message.photo) {
    ctx.reply(_.sample(replies.loading));
    const promises = [];
    const photos = ctx.message.photo;
    for (let i = 0; i < photos.length; i += 1) {
      const photo = photos[i];
      promises.push(telegram.getFileLink(photo.file_id));
    }
    promise = promise
      .then(() => Promise.all(promises))
      .then(values => getExpressFileLink(values[values.length - 1]))
      .then(publicUrl => ocr(publicUrl));
  } else if (ctx.message.text) {
    if (ctx.message.text === '/superSillyMode') {
      toggle = 1;
      ctx.reply('Super Silly Mode ACTIVATED');
      return;
    }
    if (ctx.message.text === '/goodBoiMode') {
      toggle = 0;
      ctx.reply('I will be a good boi now');
      return;
    }

    promise = promise.then(() => ctx.message.text);
  }

  const { key, languageName } = getRandomLang();
  promise
    .then(text => translate(encodeURIComponent(text), key))
    .then((res) => {
      let returnVal = '';
      res.forEach((item) => {
        returnVal += `${item.translatedText}\n`;
      });
      return returnVal;
    })
    .then((sentence) => {
      if (toggle) {
        return sillyfier(sentence);
      }
      return sentence;
    })
    .then((sentence) => {
      if (key !== 'en') {
        ctx.reply(`I dont speak english, but I do know ${languageName}: ${sentence}`);
      } else {
        ctx.reply(`Here's your translation: ${sentence}`);
      }
    });
});
bot.startPolling();

const getRandomLang = () => {
  if (Math.random() < toggle * 0.1) {
    const languageKeys = Object.keys(languages);
    const randomIndex = Math.floor(Math.random() * (languageKeys.length - 1));
    return {
      key: languageKeys[randomIndex],
      languageName: languages[languageKeys[randomIndex]].name,
    };
  }
  return { key: 'en', languageName: 'English' };
};
