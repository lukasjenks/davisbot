const Discord = require('discord.js');
const auth = require('./auth.json');
const token = auth.token;
const MIN_INTERVAL = 2 * 60 * 1000;

// Import helper function modules
const quote = require('./src/cmd/quote');
const author = require('./src/cmd/author');
const pic = require('./src/cmd/pic');
const update = require('./src/cmd/update');
const help = require('./src/cmd/help');
const ascii = require('./src/cmd/ascii');
const emoji = require('./src/lib/emoji');

const cmdModules = {quote,author,pic,update,help,ascii};

const utils = require('./lib/utils');

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
            let msgInfo = utils.getMsgInfo(msg);

            let nameOfCmd = msgInfo.msgArr[0].slice(1);
            // Call dynamically built func call; e.g. author.cmdHandler(msg); -> located in src/author.js
            if (cmdModules[nameOfCmd] && cmdModules[nameOfCmd]['fnWrapper'] && cmdModules[nameOfCmd]['fnWrapper']['cmdHandler']) {
                cmdModules[nameOfCmd]['fnWrapper']['cmdHandler'](msgInfo);
            } else {
                msg.channel.send("Command not recognized. For a list of valid commands, use !help");
            }

        } else {
            // split message content on whitespace to isolate into individual char groups
            // var messageArr = msg.content.split(/(\s+)/).filter( function(e) { return e.trim().length > 0; } );
            if (msg.content.match(/^[^\s]+\s+\*\s+[0-9]+$/)) {
                let msgInfo = utils.getMsgInfo(msg);
                emoji.multiply(msgInfo, client);
                // TODO: add chat.replyToUser() functionality here
            }
        }
    }
});