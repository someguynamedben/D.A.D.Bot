/*
Discord bot tutorial
https://www.freecodecamp.org/news/create-a-discord-bot-with-javascript-nodejs/
*/

// load .env file into an environment variable
require('dotenv').config()

// import discord.js library
const { Client, Intents } = require('discord.js');

// create new discord connection client
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

// client ready check
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

// when a user sends a message check message content for commandss
client.on("message", msg => {
  // replies with a "pong"
  if (msg.content === "!ping") {
    msg.reply("pong");
  }

  // replies with an image of an AI generated anime girl (results may vary)
  if (msg.content === "!waifu") {
    var seed = Math.floor(Math.random() * 99999)
    msg.reply("Here's your new waifu!\n https://thisanimedoesnotexist.ai/results/psi-1.0/seed" + seed + ".png");
  }

  // returns code repo
  if (msg.content === "!repo") {
    msg.reply("Feel free to submit a pull request!\nhttps://github.com/someguynamedben/D.A.D.Bot");
  }

  // replies with a list of commands and a brief description
  if (msg.content === "!commands") {
    msg.reply("Command list: ```!ping  :  pongs your ping.\n!waifu  :  AI generated waifu.\n!repo  :  D.A.D.Bot's repository.```");
  }
})

// use API key to login to discord
client.login(process.env.DISCORD_TOKEN)