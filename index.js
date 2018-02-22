require('dotenv').config()

const Telegraf = require('telegraf')
const moment = require('moment')
const bot = new Telegraf(process.env.BOT_TOKEN)

bot.start(ctx => {
  console.log(`${ctx.from.username} started`)
  ctx.reply('Allahu Akbar')
})

bot.startPolling()

bot.hears(/.*/, ctx => {
  ctx.reply(ctx.message.text + ' enviado ' + moment().format('DD/MM/YY H:mm'))
})
