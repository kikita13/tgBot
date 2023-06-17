import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters'
import { ogg } from './ogg.js';
import config from 'config'
import { openai } from './openai.js';
import { code } from 'telegraf/format';
// const bot = new Telegraf(process.env.TOKEN)
const bot = new Telegraf(config.get('TOKEN'))

bot.command('start', async (ctx) => await ctx.reply(`Hello, ${ctx.message.from.username || ctx.message.from.first_name}`));

bot.on(message('voice'), async (ctx) => {
  try {
    await ctx.reply(code('asd'))
    const link = await ctx.telegram.getFileLink(ctx.message.voice.file_id) 
    const userId = String(ctx.message.from.id)
    const oggPath =  await ogg.create(link.href, userId)
    const mp3Path = await ogg.toMp3(oggPath, userId)
    
    const text = await openai.transcription(mp3Path)
    // const response = await openai.chat(text) 
    await ctx.reply(text)
  } catch (error) {
    console.log(`Error while voice message ${error.message}`);
  } 
})




bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));