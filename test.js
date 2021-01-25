const mongoService = require('./services/mongodb')

mongoService.initClient(() => {
    mongoService.getClient()
    .db()
    .collection('event-cryz')
    .find()
    .toArray()
    .then(data => {
        data.forEach(item => {
            mongoService.getClient()
            .db()
            .collection('event')
            .updateOne({
                id: item.id
            }, {
                $set: {
                    username: item.username,
                    lastSentOn: item.sentOn,
                    lastSentOnDate: item.sentOnDate
                }, 
                $inc: {
                    entries: 1
                }
            }, {
                upsert: true
            }).then(() => {
                console.log('done')
            })
        })
    })
  });