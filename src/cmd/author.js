const Discord = require('discord.js');
const db = require('../lib/db');
const utils = require('../lib/utils');

class Author {

    constructor(subCmd, name=null, url=null, fullName=null) {
        this.subCmd = subCmd;
        this.name = name ? name.toLowerCase() : null;
        this.fullName = fullName;
    }

    authorAdd(channel) {
        db.run('insert into author (command, full_name, picture_url) values (?, ?, ?)', [this.name, this.fullName, this.url], (err) => {
            if (err) {
                channel.send("An error occured. Usage: !authoradd [name] [picture url] \"[full name]\". Error: " + err.Error);
                console.log(err);
            } else {
                channel.send("Successfully added author to DB. Quotes can now be added for this author.");
            }
        });
    }

    authorList(channel) {
        db.all(`select command from author order by command`, [], (err, authorRecs) => {
            if (err) {
                channel.send("An error occured. Error: " + err.Error);
            } else {
                let message = "Available Authors in DB:\n";
                authorRecs.forEach((authorRec) => {
                    message = message + authorRec.command + "\n";
                });
                channel.send(message);
            }
        });
    }
}

// Wrap cmdHandler function in this way such that it can be called by building a dynamically generated
// string of the function name in bot.js
const cmdHandler = (msgInfo) => {
    // Extract with regex
    // !author list
    // !author add [name] [url] [full name]
    let fields = null;
    switch (msgInfo.msgArr[1]) {
        case "add":
            fields = msgInfo.content.match(msgInfo.regex.authorAddCmd);
            break;
        case "list":
            fields = msgInfo.content.match(msgInfo.regex.authorListCmd);
            break;
        default:
            break;
    }
    
    if (fields === null) {
        utils.invalidUsage("!author", msgInfo.channel);
        return;
    }

    // Captured fields in the result of match start at index 1
    fields = fields.slice(1);
    let author = new Author(...fields);

    // Call appropriate class function dynamically - e.g. picAdd
    author["author" + utils.titleCase(fields[0])](msgInfo.channel);
}

module.exports = { cmdHandler };
