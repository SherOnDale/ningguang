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

    if (message.content.startsWith(config.prefix)) {
      const args = message.content
        .slice(config.prefix.length)
        .trim()
        .toLowerCase()
        .split(/ +/g);
      const commandName = args.shift().toLowerCase();

      if(commandName === 'info') {
          let pageNumber = Number.parseInt(args[0])
          if (Number.isNaN(pageNumber) || pageNumber < 1) pageNumber = 1;
          mongoService
            .getClient()
            .db()
            .collection('event')
            .find()
            .toArray()
            .then((result) => {
                const total = result.reduce((acc, cur) => {
                    acc += cur.entries
                    return acc
                }, 0)
                let descriptionText = "";
                if ((pageNumber - 1) * 10 >= result.length) {
                  pageNumber = Math.ceil(result.length / 10)
                }
                for (
                  let i = (pageNumber - 1) * 10;
                  i < pageNumber * 10 && result[i];
                  i++
                ) {
                  descriptionText += `${i + 1}. ${result[i].username} - ${result[i].entries}\n`;
                }
                let footerMessage = `Page ${pageNumber} of ${Math.ceil(
                  result.length / 10
                )}`;
                if (result.length > pageNumber * 10) {
                  footerMessage += ` | Do ${config.prefix}info ${
                    pageNumber + 1
                    } to proceed to the next page`;
                }
                const listEmbed = new Discord.MessageEmbed()
                .setTitle(`${total} Entries`)
                .setDescription(descriptionText)
                .addField(
                  "Controls",
                  "React to this message with :gear: to show the list controls."
                )
                .setColor("#ff00ff")
                .setFooter(footerMessage);
                client.channels.cache.get(message.channel.id).send(listEmbed)
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
                if(doc && doc.lastSentOn > Date.now() - (1000 * 60 * 60)) {
                    shouldAdd = false
                    const secondsRemaining = 3600 - Math.floor((Date.now() - doc.lastSentOn) / 1000)
                    client.channels.cache.get(config.botSpamId).send('<@' + message.author.id + '>, your cooldown ends in ' + Math.floor(secondsRemaining / 60).toString()
                     + ' minute(s) and ' + secondsRemaining % 60 + ' second(s)')
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