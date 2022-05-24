/*
Discord bot tutorial
https://www.freecodecamp.org/news/create-a-discord-bot-with-javascript-nodejs/
*/

import { Client, Intents, MessagePayload } from 'discord.js'
import { createAudioResource, StreamType, VoiceConnectionStatus, AudioPlayer, } from '@discordjs/voice';
import dotenv from 'dotenv'
import discordTTS from 'discord-tts'
import { connectToChannel, startTimeout, stopTimeout } from './textToSpeech.js';
import { selectRandomAnime } from './anime-selector.js';
import launchRPG from './rpg/start.js'


const commands = ["!play", "!commands", "!anime", "!waifu", "!repo"];

export let RPGPlayers = {};

// load .env file into an environment variable
dotenv.config();

// create new discord connection client
const client = new Client({ intents: [
    Intents.FLAGS.GUILDS, 
    Intents.FLAGS.GUILD_MESSAGES, 
    Intents.FLAGS.GUILD_VOICE_STATES
  ]
});

// client ready check
client.on("ready", () => {
  let user = client.user.tag;
  console.log("[" + new Date().toLocaleString() + "] Logged in as " + user + "!");
})

// when a user sends a message check message content for commandss
client.on("messageCreate", msg => {

  if(msg.channel.name === "tbd" && msg.member.id != msg.guild.me.id && msg.content === "!play"){
    // check if not in list of players
    if(!(msg.member.id in RPGPlayers)){
      console.log(`[` + new Date().toLocaleString() + `] !play : Player does not exist. Creating player.`)
      RPGPlayers[msg.member.id] = 0;
    }

    if(!RPGPlayers[msg.member.id]){   // 0 if not playing, 1 if playing
      RPGPlayers[msg.member.id] = 1;

      if(!commands.includes(msg.content, 1)){
        // launch game
        launchRPG(client);
        console.log(`[` + new Date().toLocaleString() + `] !play : Game launched for user ` + msg.member.id);
      }
    }
  }

  if(msg.channel.name === "no-mic-corner" && msg.member.id != msg.guild.me.id){
    // get voice channel that the user is in
    let voiceChannel = msg.member.voice.channel;

    let audioPlayer = new AudioPlayer();

    if(voiceChannel){
			try{
        // attempt connection to channel
				const connection = connectToChannel(voiceChannel);

        // translate message into speach
        const stream = discordTTS.getVoiceStream(msg.member.displayName + " says " + msg.content);

        // create audio resource from tts message
        const audioResource = createAudioResource(stream, {inputType: StreamType.Arbitrary, inlineVolume:true});
        
        if(connection.status === VoiceConnectionStatus.Connected){
          // grab the audio player and play the message
          connection.subscribe(audioPlayer);
          audioPlayer.play(audioResource);
          
          // clear timeout if already counting
          stopTimeout();

          // Start counting inactivity
          startTimeout(connection);
        }
			}catch(error){
				console.error(error);
			}
		}else{
			msg.channel.send(`${msg.member.displayName}, you need to join a voice channel first ya silly.`)
        .then(() => console.log(`[` + new Date().toLocaleString() + `] TTS : Unable to join channel, ${msg.member.displayName} is not in a voice channel.`))
        .catch(console.error);
		}
  }

  // replies with an image of an AI generated anime girl (results may vary)
  if(msg.content === "!waifu"){
    let seed = Math.floor(Math.random() * 99999)
    msg.channel.send("Here's your new waifu!\n https://thisanimedoesnotexist.ai/results/psi-1.0/seed" + seed + ".png")
      .then(() => console.log(`[` + new Date().toLocaleString() + `] !waifu : Replied waifu image link.`))
      .catch(console.error);
  }

  // returns code repo
  if(msg.content === "!repo"){
    msg.channel.send("Feel free to submit a pull request!\nhttps://github.com/someguynamedben/D.A.D.Bot")
      .then(() => console.log(`[` + new Date().toLocaleString() + `] !repo : Sent repo link.`))
      .catch(console.error);
  }

  // Select a random anime from the anime-list.csv file
  if(msg.content === '!anime'){
    const flavorMessages = [
      '_May God have mercy on your soul._',
      `_I'm not sure what to say._`,
      `_${msg.member.displayName} may have bribed me to pick this one..._`,
      `_I'm not sure if I'm sorry for suggesting this one or not.._`,
      `_Remember to tip your bots!_`,
      `_Beep Boop! Anime has been dispensed! Brrt Brrt!_`,
      `_Lorem ipsum dolor sit anime, consectetur adipiscing elit..._`,
      `_Is this too depraived? I can't tell._`,
      `_Hey man, you wanted random not me._`,
      `_Ah yes, "random"._`,
      `_hmmm.._`,
      `_Excuse me, but are you by any chance the oddball in your family?_`,
      `_This is a treasure for all mankind._`,
      `_If I had a dollar for every time this came up I'd have one dollar._`,
      `_Wait, did you say you wanted a good anime?_`,
      `_We can reroll if you want.._`,
      `_No take backs!_`,
      `_Don't worry ${msg.member.username}, I knew what you were itching to watch._`,
      `_Oh this is gonna be interesting._`,
      `@a rubber ducky#7889 _please don't ban me for this one._`,
      `_Something something uwu_`,
      `_All your base are belong to us._`,
      `_WEEEB! ...sorry, was that out loud?_`,
      `_A true ass man once said: "Boobs are nothing more than a pale imitation of the buttocks!"_`,
      `_Why? Because anime._`,
      `_I swear I picked this one randomly._`,
      `_Better start drinking now.._`,
      `_And now a message from our sponsor.. Raid Shadow Legends!_`,
      `_And now a message from our sponsor.. Nord VPN!_`,
      `_And now a message from our sponsor.. G Fuel!_`,
      `:feelsbadman:`,
      `:pogchamp:`,
      `:kappa:`,
      `:2867_CatRee:`,
      `:confused~1:`,
      `:facepalm:`,
      `:fry:`,
      `:oof:`,
      `:lul:`,
      `:seemsgood:`,
      `:kreygasm:`,
      `:praiseit:`,
      `:wutface:`,
      `:teemo:`,
      `:thinkingblackguy:`,
    ]

    selectRandomAnime().then(anime => {
      if (anime.isError) {
        msg.channel.send(new MessagePayload(msg.channel, {
          content: `Whoops, I couldn't figure out what anime to pick...\n`
            + `So fuck it, just watch ${anime.title} instead.\n`
            + `${anime.url}`
        }))
          .then(() => console.log(`[` + new Date().toLocaleString() + `] !anime : Default anime due to error.`))
          .catch(console.error);
      }else{
        msg.channel.send(new MessagePayload(msg.channel, {
          content: `Your randomly suggested anime is ${anime.title}.\n`
            + `${anime.url}\n`
            + `${flavorMessages[Math.floor(Math.random() * flavorMessages.length)]}`,
        }))
          .then(() => console.log(`[` + new Date().toLocaleString() + `] !anime : Send random anime from DB.`))
          .catch(console.error);
      }
    });
  }

  // replies with a list of commands and a brief description
  if(msg.content === "!commands"){
    msg.channel.send(new MessagePayload(msg.channel, {
      content: "Command list: ```"
      + "!commands :  List of available commands.\n"
      + "!anime    :  Random Crunchyroll anime with link.\n"
      + "!waifu    :  Image of an AI generated waifu.\n"
      + "!repo     :  D.A.D.Bot's repository.```\n"
      + "Also messages sent in the #no-mic-corner channel will be read out with TTS in the voice channel you're in."
    }))
      .then(() => console.log(`[` + new Date().toLocaleString() + `] !commands : Replied with commands list.`))
      .catch(console.error);
  }
})

// use API key to login to discord
client.login(process.env.DISCORD_TOKEN)