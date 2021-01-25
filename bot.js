const Discord = require('discord.js')
const config = require('./config')

const client = new Discord.Client()

client.login(config.botToken)
client.on("ready", function (evt) {
  console.log("Connected");
  console.log(`Logged in as ${client.user.tag}`);
});
