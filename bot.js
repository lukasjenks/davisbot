const Discord = require('discord.js');
const auth = require('./auth.json');
const token = auth.token;

const MIN_INTERVAL = 2 * 60 * 1000;

// Import helper function modules
const quote = require('./src/quote');
const author = require('./src/author');
const picture = require('./src/picture');
const utils = require('./src/utils');
const update = require('./src/update');
const emoji = require('./src/emoji');

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
    // Command Mode
    if (msg.content.charAt(0) === '!') {
        // Split on whitespace for parsing of command
        var messageArr = msg.content.split(/(\s+)/).filter(function (e) { return e.trim().length > 0; });

        switch (messageArr[0]) {
            case "!author":
                author.authorCommand(msg, messageArr);
                break;
            case "!help":
                utils.helpCommand(msg);
                break;
            case "!pic":
                picture.picCommand(msg, messageArr);
                break;
            case "!quote":
                quote.quoteCommand(msg, messageArr);
                break;
            case "!update":
                update.updateCommand(msg, messageArr);
                break;
            default:
                break;
        }
    } else {
        var messageArr = msg.content.split(/(\s+)/).filter(function (e) { return e.trim().length > 0; });
        if (!msg.author.bot) {

            emoji.multiply(msg, client);

            // msg.content = msg.content.toLowerCase();


            // Here, you can check to see if msg.content.indexOf("custom string") returns > -1 to check for something
            // that was said by a user, or msg.author.id to determine the author of the message
            // and then take the desired action based on this. Lots of potential for fun stuff here.
        }
    }
});
