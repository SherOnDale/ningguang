const Discord = require('discord.js')
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

    try {

    if(message.mentions.members.has(config.retardedId)) {
        mongoService
            .getClient()
            .db()
            .collection('event-cryz')
            .find({}, {
                sort: {
                    sentOn: -1
                },
                limit: 1
            })
            .toArray()
            .then((result) => {
                let shouldAdd = true
                if(result.length > 0) {
                    const doc = result[0]
                    if(doc.sentOn > Date.now() - (1000 * 60 * 60)) {
                        shouldAdd = false
                    }
                }

                if(shouldAdd) {
                    mongoService
                    .getClient()
                    .db()
                    .collection('event-cryz')
                    .insertOne({
                        username: message.author.tag,
                        id: message.author.id,
                        sentOn: Date.now(),
                        sentOnDate: new Date()
                    })
                }
            })
    }
} catch(e) {
    console.log(e)
}
})