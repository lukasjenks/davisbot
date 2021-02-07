const Discord = require('discord.js');
const sqlite3 = require('sqlite3').verbose();
const auth = require('./auth.json');
const token = auth.token;
const MIN_INTERVAL = 2 * 60 * 1000;

// open db
let db = new sqlite3.Database('bot.db', (err) => {
	if (err) {
		return console.error(err.message);
	}
	console.log('Connected to the DB.');
});

const client = new Discord.Client();
client.login(token);

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
        
        if (messageArr[0] === '!quote') {
            quoteCommand(msg, messageArr);
        }
    }
});

quoteCommand = (msg, messageArr) => {
    if (messageArr.length < 2) {
        msg.channel.send("Improper usage. Usage: !quote [cmd] [args]");
    }

    switch(messageArr[1]) {
        case "author":
            if (messageArr.length === 3) {
                fetchQuoteByAuthor(messageArr[2]);
            } else {
                msg.channel.send("Improper usage. Usage: !quote author [name]");
                return;
            }
            break;
        case "about":
            if (messageArr.length === 3) {
                fetchQuoteByTopic(messageArr[2]);
            } else {
                msg.channel.send("Improper usage. Usage: !quote about [topic]");
                return;
            }
            break;
        case "random":
            fetchRandomQuote();
            break;
        default:
            msg.channel.send("Invalid quote command. Use !help to view proper usage.");
    }
}

fetchQuoteByAuthor = (name) => {

}

/*
Function: fetchRandomQuote
Purpose: Given a message object msg, sends a rich embedded Discord message to
         the Discord channel the message originated from.
Arguments: msg (Object)
Returns: None
Side Effects: Sends richembed message to msg's origin (discord channel)
*/
fetchRandomQuote = () => {
    db.get(`select top 1 authorid from quote order by RANDOM()`, (err, quoteRec) => {
        if (err) {
            msg.channel.send("A error has occured while retrieving the quote. Error: " + err.Error);
        } else if (quoteRec !== undefined) {
            db.get('select full_name, picture_url from author where id = ?', [quoteRec.authorid], (err, authorRec) => {
                if (err) {
                    msg.channel.send("An error occured. Usage: !quote [author]. Error: " + err.Error);
                } else if (authorRec !== undefined) {
                    const embed = new Discord.RichEmbed()
                        .setDescription(quoteRec.content)
                        .setAuthor(authorRec.full_name, authorRec.picture_url)
                        .setColor('#f50057');
                    msg.channel.send(embed);
                } else {
                    msg.channel.send("No quotes found in the DB.");
                }
            });
        } else {
            msg.channel.send("No quotes found in the DB.");
        }
    });
}