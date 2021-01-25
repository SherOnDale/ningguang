const config = require('./config')
const mongoService = require("./services/mongodb");
const express = require('express')

mongoService.initClient(() => {
  console.log("Connected to the database");
});

const app = express()

app.get('/', (req, res) => {
    mongoService
      .getClient()
      .db()
      .collection('event-cryz')
      .find()
      .toArray()
      .then((result) => {
        res.status(200).json(result)
      })
  })

  app.listen(config.port, () => {
    console.log('Listening to port ', config.port)
  })
  