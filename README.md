# D.A.D.Bot 

This is a simple Discord bot I created in JavaScript with [this tutorial](https://www.freecodecamp.org/news/create-a-discord-bot-with-javascript-nodejs/). It listens to user comments and replies to simple user commands. It's built using the discord.js library, and I have it running with node.js via terminal.

## Getting Started

### Dependencies

* node.js >= v14.0.0
* npm >= 7.0.0
* discord.js >= v13.5.1
* dotenv >= v12.0.0

### Installing

###### Linux

Open up a terminal and run the following commands:
```
sudo apt install nodejs
sudo apt install npm
npm i dotenv
npm i discord-tts
npm i @discordjs/opus
npm install discord.js
npm install @discordjs/voice
npm install libsodium-wrappers
npm install ffmpeg
```

###### Windows

Download and run the msi installer from the [official website](https://nodejs.org/en/), which comes with node and npm together.
After the installer finishes make sure the install has been added to path by checking the version `node -v` and `npm -v`.
In the directory for your project with your package.json in it, run the following commands:
```
npm i dotenv
npm i discord-tts
npm i @discordjs/opus
npm install discord.js
npm install @discordjs/voice
npm install libsodium-wrappers
npm install ffmpeg
```
Create a `.env` file in the working directory and paste in the following line of code with your API key applied to the correct location:
```
DISCORD_TOKEN=<API token>
```

### Executing program

Open a terminal (or command prompt) and run:
```
node main.js
```

## Help

* Make sure you add the dotenv package and discord.js install in the same directory as your package.json for the project.
* API key in the .env file needs to be in the format `<TOKEN_NAME>=<API key>`.
* Make sure node and npm are added to path
* If you get `SyntaxError: Cannot use import statement outside a module` then make sure you add `"type": "module"` to `package.json`.

## Author

[Benji Stewart](https://github.com/someguynamedben)

## Version History

* 0.1
    * Initial Release

## License

This project is licensed under the MIT License - see the LICENSE file for details

## Acknowledgments

* [Discord bot tutorial](https://www.freecodecamp.org/news/create-a-discord-bot-with-javascript-nodejs/)
* [API key usage](https://medium.com/@soni.dumitru/keeping-your-api-keys-secret-with-dotenv-b66aa05fdf71)
