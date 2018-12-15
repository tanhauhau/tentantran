// communicate with user
const Telegraf = require('telegraf');
// communicate with telegram server
const Telegram = require('telegraf/telegram');
const { initExpressServer, getExpressFileLink } = require('./utils/file');
const ocr = require('./utils/ocr');

initExpressServer();

const tempBotToken = process.env.BOT_TOKEN;

require('dotenv').load();

console.log('telegram bot started');

let bot;
let telegram;
if (tempBotToken) {
  bot = new Telegraf(tempBotToken);
  telegram = new Telegram(tempBotToken, []);
} else {
  bot = new Telegraf(process.env.BOT_TOKEN);
  telegram = new Telegram(process.env.BOT_TOKEN, []);
}
bot.start(ctx => ctx.reply('welcome'));
bot.help(ctx => ctx.reply('Send me some image to translate!'));
bot.on('sticker', ctx => ctx.reply('👍'));
bot.on('message', (ctx) => {
  const promises = [];
  if (ctx.message.photo) {
    const photos = ctx.message.photo;
    for (let i = 0; i < photos.length; i += 1) {
      const photo = photos[i];
      promises.push(telegram.getFileLink(photo.file_id));
    }
    Promise.all(promises)
      .then(values => getExpressFileLink(values[values.length - 1]))
      .then(publicUrl => ocr(publicUrl))
      .then(text => console.log('text:', text));
  }
  // telegram.getFile(ctx.)
});
bot.hears('hi', ctx => ctx.reply('Hey there'));
bot.startPolling();

// // bluebird each polyfill
// Promise.each = (arr, fn) => { // take an array and a function
//   // invalid input
//   if (!Array.isArray(arr)) return Promise.reject(new Error('Non array passed to each'));
//   // empty case
//   if (arr.length === 0) return Promise.resolve();
//   return arr.reduce((prev, cur) => prev.then(() => fn(cur)), Promise.resolve());
// };
