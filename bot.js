const Discord = require('discord.js');
const auth = require('./auth.json');
const token = auth.token;
const MIN_INTERVAL = 2 * 60 * 1000;

// Import helper function modules
const quote = require('./src/cmd/quote');
const author = require('./src/cmd/author');
const picture = require('./src/cmd/pic');
const update = require('./src/cmd/update');
const utils = require('./src/lib/utils');
const emoji = require('./src/lib/emoji');
const ascii = require('./src/cmd/ascii');

const client = new Discord.Client();

client.login(token)
.catch((err) => {
    console.log("An error occured: " + err);
});

// Upon bot connection
client.on('ready', () => {
	console.log("Connected to Discord.");
});

// Handle comands
client.on('message', (msg) => {
    if (!msg.author.bot) {
        // Command Mode
        if (msg.content.charAt(0) === '!') {
            // Split on whitespace for parsing of command
            var msgArr = msg.content.split(/(\s+)/).filter( function(e) { return e.trim().length > 0; } );
            let nameOfCmd = msgArr[0].slice(1);

            try {
                let msgInfo = {content: msg.content, channel: msg.channel, msgArr: msgArr};
                // Call dynamically built func call; e.g. author.cmdHandler(msg); -> located in src/author.js
                [nameOfCmd]['fnWrapper']['cmdHandler'](msgInfo);
            } catch (error) {
                console.log(error);
                msg.channel.send("Command not recognized. For a list of valid commands, use !help");
            }
        } else {
            // split message content on whitespace to isolate into individual char groups
            // var messageArr = msg.content.split(/(\s+)/).filter( function(e) { return e.trim().length > 0; } );
            if (msg.content.match(/^[^\s]+\s+\*\s+[0-9]+$/)) {
                emoji.multiply(msg, client);
                // TODO: add chat.replyToUser() functionality here
            }
        }
    }
});