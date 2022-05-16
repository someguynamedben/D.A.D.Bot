export default function launchRPG(client){
    client.on("messageCreate", msg => {
        console.log(msg.content);
    });
}

function exitGame(){}