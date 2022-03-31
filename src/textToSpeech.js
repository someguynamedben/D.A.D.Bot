import {
	joinVoiceChannel,
	entersState,
	VoiceConnectionStatus,
} from '@discordjs/voice';


/**
 * Creates a connection to the provided voice channel and connects to it.
 * 
 * @params voiceChannel: discord voice channel
 * @returns discord connection object
 */
export function connectToChannel(voiceChannel){
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

/**
 * Disconnects the bot from the voice channel after 10 minutes of inactivity.
 * 
 * @param connection: discord connection object
 */
function timeoutCounter(connection){
  timeoutInterval = setTimeout(() => {
    console.log("[" + new Date().toLocaleString() + "] Disconnecting from voice channel due to inactivity.");
    connection.disconnect();    
  }, 600000);  // 10 minutes
}

/**
 * Starts voice connection timeout for inactivity
 *
 * @param connection: discord connection object
 */
export function startTimeout(connection){
  if(!isTimerOn){
    isTimerOn = true;
    // start counting the timeout
    timeoutCounter(connection);
  }
}

/**
* Stops voice connection timeout for inactivity
*/
export function stopTimeout(){
  clearTimeout(timeoutInterval);
  isTimerOn = false;
}