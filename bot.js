const Discord = require('discord.js')
const config = require('./config')
const Tesseract = require('tesseract.js')

const worker = Tesseract.createWorker({
    logger: m => console.log(m)
})

const BOT_USER_ID = '803217389071892494'

const client = new Discord.Client()

client.login(config.botToken)
client.on("ready",  async (evt) => {
  console.log("Connected");
  console.log(`Logged in as ${client.user.tag}`);
  await worker.load()
  await worker.loadLanguage('jpn')
  await worker.initialize('jpn')
  console.log('worker ready')
});

client.on('message', async (msg) => {
     if(msg.mentions.users.has(BOT_USER_ID) && msg.attachments.size > 0) {
         const fileUrl = msg.attachments.first().url
         console.log(fileUrl)
         const { data: { text } } = await worker.recognize(fileUrl);
         msg.reply(text)
     }
})