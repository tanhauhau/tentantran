const Telegraf = require('telegraf');

const tempBotToken = process.env.BOT_TOKEN;

require('dotenv').load();

let bot;
if (tempBotToken) {
  console.log('using tempBotToken')
  bot = new Telegraf(process.env.BOT_TOKEN);
} else {
  bot = new Telegraf(process.env.BOT_TOKEN);
}
bot.start(ctx => ctx.reply('welcome'));
bot.help(ctx => ctx.reply('Send me some image to translate!'));
bot.on('sticker', ctx => ctx.reply('👍'));
bot.hears('hi', ctx => ctx.reply('Hey there'));
bot.startPolling();
