/*
Discord bot tutorial
https://www.freecodecamp.org/news/create-a-discord-bot-with-javascript-nodejs/
*/

import { Client, Intents } from 'discord.js'
import {
	joinVoiceChannel,
	createAudioResource,
	entersState,
	StreamType,
	VoiceConnectionStatus,
  AudioPlayer,
} from '@discordjs/voice';
import dotenv from 'dotenv'
import discordTTS from 'discord-tts'

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
* Args: discord voice channel
* Return: connection to voice channel
*
* Creates a connection to the provided voice channel and connects to it.
*/
function connectToChannel(voiceChannel){
	const connection = joinVoiceChannel({
    channelId: voiceChannel.id,
    guildId: voiceChannel.guild.id,
    adapterCreator: voiceChannel.guild.voiceAdapterCreator,
  });

	try{
		entersState(connection, VoiceConnectionStatus.Ready, 30e3);
    console.log("[" + new Date().toLocaleString() + "] connected to voice channel")
		return connection;
	}catch(error){
		connection.destroy();
    console.log("[" + new Date().toLocaleString() + "] could not connect to voice channel");
		throw error;
	}
}

// client ready check
client.on("ready", () => {
  let user = client.user.tag;
  console.log("[" + new Date().toLocaleString() + "] Logged in as " + user + "!");
})

// when a user sends a message check message content for commandss
client.on("message", msg => {

  if(msg.channel.name === "no-mic-corner" && msg.member.displayName != "D.A.D.Bot"){
    let voiceChannel = msg.member.voice.channel;

    let audioPlayer = new AudioPlayer();

    if(voiceChannel){
			try{
				const connection = connectToChannel(voiceChannel);
        const stream=discordTTS.getVoiceStream(msg.member.displayName + " says " + msg.content);
        const audioResource = createAudioResource(stream, {inputType: StreamType.Arbitrary, inlineVolume:true});
        
        if(connection.status === VoiceConnectionStatus.Connected){
            connection.subscribe(audioPlayer);
            audioPlayer.play(audioResource);
        }
			}catch(error){
				console.error(error);
			}
		}else{
			msg.reply('You need to join a voice channel first.');
		}
    //TODO: add timout for inactivity to have the bot leave the channel after inactivity
  }

  // replies with a "pong"
  if(msg.content === "!ping"){
    // msg.messageCreate
    msg.reply("pong");
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

  // replies with a list of commands and a brief description
  if(msg.content === "!commands"){
    msg.reply("Command list: ```!ping  :  pongs your ping.\n!waifu :  AI generated waifu.\n!repo  :  D.A.D.Bot's repository.```\nAlso messages sent in the #no-mic-corner channel will be read out with TTS in the voice channel you're in.");
  }
})

// use API key to login to discord
client.login(process.env.DISCORD_TOKEN)