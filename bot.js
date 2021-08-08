const Discord = require('discord.js');
const auth = require('./auth.json');
const token = auth.token;
const MIN_INTERVAL = 2 * 60 * 1000;

// Import cmd handlers
const quote = require('./src/cmd/quote');
const author = require('./src/cmd/author');
const pic = require('./src/cmd/pic');
const update = require('./src/cmd/update');
const help = require('./src/cmd/help');
const ascii = require('./src/cmd/ascii');
const emoji = require('./src/lib/emoji');
const define = require('./src/cmd/define');

const cmdModules = {quote,author,pic,update,help,ascii,define};

const utils = require('./src/lib/utils');
const regex = require('./src/lib/regex'); // precompiled regex are faster than inline

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
        // Command mode
        if (msg.content.charAt(0) === '!') {
            let nameOfCmd = msg.content.split(" ")[0].trim().slice(1); // extract nameOfCmd from ![nameOfCmd] [arg]
            let msgInfo = nameOfCmd.length > 1 ? utils.getMsgInfo(msg, regex[nameOfCmd]) : null;
            // Call dynamically built func call; e.g. author.cmdHandler(msg); -> located in src/author.js
            if (cmdModules[nameOfCmd] && cmdModules[nameOfCmd]['cmdHandler']) {
                cmdModules[nameOfCmd]['cmdHandler'](msgInfo);
            } else {
                msg.channel.send("Command not recognized. For a list of valid commands, use !help");
            }
        // Emoji command mode: emoji command format: emoji * n || n * emoji
        } else if (regex.emoji.emojiCmd.test(msg.content)) {
            let msgInfo = utils.getMsgInfo(msg, regex['emoji'], client);
            emoji.multiply(msgInfo);
        }
    }
});
