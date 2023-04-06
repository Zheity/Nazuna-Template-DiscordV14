const client = require("../../index");
const config = require('../../Config/config.json')
const { ActivityType } = require('discord.js')
const chalk = require("chalk");
const mongoose = require("mongoose")
const mongodbURL = config.Mongo_URL

module.exports = {
  name: 'ready',
  once: true,

  /**
   * @param {Client} client 
   */
  async execute(client) {

    let status = [
      `/help | ${client.guilds.cache.size.toLocaleString('en-US')} Servidores`,
      `/help | ${client.users.cache.size.toLocaleString('en-US')} Usuarios`,
    ],
      i = 0
    setInterval(() => {
      client.user.setActivity(`${status[i++ % status.length]}`, {
        type: ActivityType.Playing
      })
    }, 60000);
    console.log(chalk.blueBright(`[READY] Bot Online!`));

    if (!mongodbURL) return

    mongoose.set("strictQuery", false);
    mongoose.connect(mongodbURL, {
  
      useNewUrlParser: true,
      useUnifiedTopology: true
  
    }).then(() => {
  
      console.log("Conectado a Database!")
  
    }).catch(err => console.log(err))

  }
}