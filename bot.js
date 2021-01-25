const Discord = require('discord.js');
const { Cursor } = require('mongodb');
const config = require('./config')
const mongoService = require("./services/mongodb");

const client = new Discord.Client()

client.login(config.botToken)
client.on("ready", function (evt) {
  console.log("Connected");
  console.log(`Logged in as ${client.user.tag}`);

  mongoService.initClient(() => {
    console.log("Connected to the database");
  });
});

client.on('message', async function (message) {
    if(message.author.bot) return

    if (message.content.startsWith(prefix)) {
      const args = message.content
        .slice(config.prefix.length)
        .trim()
        .toLowerCase()
        .split(/ +/g);
      const commandName = args.shift().toLowerCase();
  
      const command =
        client.commands.get(commandName) ||
        client.commands.find(
          (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
        );

      if(command === 'info') {
          let pageNumber = Number.parseInt(args[0])
          if (Number.isNaN(pageNumber) || pageNumber < 1) pageNumber = 1;
          mongoService
            .getClient()
            .db()
            .collection('event-cryz')
            .find()
            .toArray()
            .then((result) => {
                const listEmbed = new Discord.MessageEmbed()
                .setTitle(`${result.length} Entries`)
                result.reduce((acc, cur) => {
                    if(!acc.find(i => i.id === cur.id)) acc.push
                    if(!acc[cur.id]) acc[cur.id] = {}
                    acc[cur.id].username = cur.username
                    acc[cur.id].count = acc[cur.id].count? aacc[cur.id].count++ : 1
                    return acc
                }, {})
            })
      }
    }

    try {

    if(message.mentions.members.has(config.retardedId)) {
        mongoService
            .getClient()
            .db()
            .collection('event')
            .findOne({id: message.author.id})
            .then((doc) => {
                let shouldAdd = true
                if(doc.lastSentOn > Date.now() - (1000 * 60 * 60)) {
                    shouldAdd = false
                }

                if(shouldAdd) {
                    mongoService
                    .getClient()
                    .db()
                    .collection('event')
                    .updateOne({
                        id: message.author.id
                    }, {
                        $set: {
                            username: message.author.tag,
                            lastSentOn: Date.now(),
                            lastSentOnDate: new Date()
                        }, 
                        $inc: {
                            entries: 1
                        }
                    }, {
                        upsert: true
                    })
                }
            })
    }
} catch(e) {
    console.log(e)
}
})