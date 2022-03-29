/*
Discord bot tutorial
https://www.freecodecamp.org/news/create-a-discord-bot-with-javascript-nodejs/
*/

import { Client, Intents, MessagePayload, VoiceState } from 'discord.js'
import {
	joinVoiceChannel,
	createAudioResource,
	entersState,
	StreamType,
	VoiceConnectionStatus,
  AudioPlayer,
  getVoiceConnection,
  VoiceConnection,
} from '@discordjs/voice';
import dotenv from 'dotenv'
import discordTTS from 'discord-tts'
import { selectRandomAnime } from './anime-selector.js';


// load .env file into an environment variable
dotenv.config();

// create new discord connection client
const client = new Client({ intents: 
  [
    Intents.FLAGS.GUILDS, 
    Intents.FLAGS.GUILD_MESSAGES, 
    Intents.FLAGS.GUILD_VOICE_STATES
  ]
});

/*
* @param : discord voice channel
* @return: connection to voice channel
*
* Creates a connection to the provided voice channel and connects to it.
*/
function connectToChannel(voiceChannel){
  // setup voice channel connection
	const connection = joinVoiceChannel({
    channelId: voiceChannel.id,
    guildId: voiceChannel.guild.id,
    adapterCreator: voiceChannel.guild.voiceAdapterCreator,
  });

	try{
    // attempt connection
		entersState(connection, VoiceConnectionStatus.Ready, 30e3);
    console.log("[" + new Date().toLocaleString() + "] connected to voice channel")

		return connection;
	}catch(error){
    // end connection on failure
    connection.disconnect()
    console.log("[" + new Date().toLocaleString() + "] could not connect to voice channel");
    
		throw error;
	}
}

let isTimerOn = false;  // inactivity timeout
let timeoutInterval;    // timer

/*
* @param : voice connection
*
* Disconnects the bot from the voice channel after 10 minutes of inactivity
*/
function timeoutCounter(connection){
  timeoutInterval = setTimeout(() => {
    console.log("[" + new Date().toLocaleString() + "] Disconnecting from voice channel due to inactivity.");
    connection.disconnect();    
  }, 600000);  // 10 minutes
}

/*
* @param : voice connection
*
* Starts voice connection timeout for inactivity
*/
function startTimeout(connection){
  if(!isTimerOn){
    isTimerOn = true;
    // start counting the timeout
    timeoutCounter(connection);
  }
}

/*
* Stops voice connection timeout for inactivity
*/
function stopTimeout(){
  clearTimeout(timeoutInterval);
  isTimerOn = false;
}



// client ready check
client.on("ready", () => {
  let user = client.user.tag;
  console.log("[" + new Date().toLocaleString() + "] Logged in as " + user + "!");
})

// when a user sends a message check message content for commandss
client.on("message", msg => {

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
			msg.reply('You need to join a voice channel first.');
		}
  }

  // replies with an image of an AI generated anime girl (results may vary)
  if(msg.content === "!waifu"){
    let seed = Math.floor(Math.random() * 99999)
    msg.reply("Here's your new waifu!\n https://thisanimedoesnotexist.ai/results/psi-1.0/seed" + seed + ".png");
  }

  // returns code repo
  if(msg.content === "!repo"){
    msg.reply("Feel free to submit a pull request!\nhttps://github.com/someguynamedben/D.A.D.Bot");
  }

  // Select a random anime from the anime-list.csv file
  if(msg.content === '!anime'){
    const flavorMessages = [
      '_May God have mercy on your soul._',
      `_I'm not sure what to say._`,
      `_${msg.author.username} may have bribed me to pick this one..._`,
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
      `_Don't worry ${msg.author.username}, I knew what you were itching to watch._`,
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
        msg.reply(new MessagePayload(msg.channel, {
          content: `Whoops, I couldn't figure out what anime to pick...\n`
            + `So fuck it, just watch ${anime.title} instead.\n`
            + `${anime.url}`
        }));
      }else{
        msg.reply(new MessagePayload(msg.channel, {
          content: `Your randomly suggested anime is ${anime.title}.\n`
            + `${anime.url}\n`
            + `${flavorMessages[Math.floor(Math.random() * flavorMessages.length)]}`,
        }));
      }
    });
  }

  // replies with a list of commands and a brief description
  if(msg.content === "!commands"){
    msg.reply("Command list: ```!anime :  Random Crunchyroll anime.\n!waifu :  AI generated waifu.\n!repo  :  D.A.D.Bot's repository.```\nAlso messages sent in the #no-mic-corner channel will be read out with TTS in the voice channel you're in.");
  }
})

// use API key to login to discord
client.login(process.env.DISCORD_TOKEN)