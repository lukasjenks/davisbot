const Discord = require('discord.js');
const sqlite3 = require('sqlite3').verbose();
const auth = require('./auth.json');
const token = auth.token;
const MIN_INTERVAL = 2 * 60 * 1000;

// Import 
const quote = require('./quote');
const author = require('./author');
const picture = require('./picture');
const utils = require('./utils');

// Open DB connection
let db = new sqlite3.Database('bot.db', (err) => {
	if (err) {
		return console.error(err.message);
	}
	console.log('Connected to the DB.');
});

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
        var messageArr = msg.content.split(/(\s+)/).filter( function(e) { return e.trim().length > 0; } );
        
        switch (messageArr[0]) {
            case "!quote":
                quote.quoteCommand(msg, messageArr, db);
                break;
            case "!author":
                author.authorCommand(msg, messageArr, db);
            case "!pic":
                picture.picCommand(msg, messageArr, db);
            case "!help":
                utils.helpCommand(msg);
            default:
                break;
        }
    }
});