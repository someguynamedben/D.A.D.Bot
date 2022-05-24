import { RPGPlayers } from "../main.js";

export default function launchRPG(client){
    client.on("messageCreate", msg => {
        console.log(msg.content);
        exitGame(msg.member.id);
    });
}

function exitGame(playerID){
    RPGPlayers[playerID] = 0;
}