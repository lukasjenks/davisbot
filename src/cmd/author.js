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
let fnWrapper = [];
fnWrapper['cmdHandler'] = (msgInfo) => {
    // Extract with regex
    // !author list
    // !author add [name] [url] [full name]
    let fields = null;
    let author = null;
    switch (msgInfo.msgArr[1]) {
        case "add":
            fields = msgInfo.content.match(/^\s*\!author\s+(add)\s+([^\s]+)\s+([^\s]+)\s+(.+)\s*$/);
            if (fields === null) {
                utils.invalidUsage("!author", msgInfo.channel);
            }
            author = new Author(fields[1], fields[2], fields[3], fields[4]);
            break;
        case "list":
            fields = msgInfo.content.match(/^\s*\!author\s+(list)\s*$/);
            if (fields === null) {
                utils.invalidUsage("!author", msgInfo.channel);
            }
            author = new Author(fields[1]);
            break;
        default:
            break;
    }
    if (fields !== null) {
        // Call appropriate class function dynamically - e.g. quoteAdd
        author["author" + utils.titleCase(fields[1])](msgInfo.channel);
    } else {
        utils.invalidUsage("!author", msgInfo.channel);
    }
}

module.exports = { fnWrapper };