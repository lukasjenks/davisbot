const Discord = require('discord.js');
const db = require('../lib/db');
const utils = require('../lib/utils');

class Update {
    constructor(subCmd, subSubCmd, resourceName, url, name) {
        this.subCmd = subCmd;
        this.subSubCmd = subSubCmd;
        this.resourceName = resourceName ? resourceName.toLowerCase() : null;
        this.url = url;
        this.name = name;
    }

    updateAuthorName() {
        db.run('update author set full_name = ? where command = ?', [this.name, this.resourceName], (err) => {
            if (err) {
                msg.channel.send("An error occured. Error: " + err);
            } else {
                msg.channel.send("Successfully changed the author's full name.");
            }
        });
    }

    updateAuthorPic() {
        db.run('update author set picture_url = ? where command = ?', [this.newUrl, this.resourceName], (err) => {
            if (err) {
                msg.channel.send("An error occured. Error: " + err.Error);
            } else {
                msg.channel.send("Successfully changed the author's picture.");
            }
        });
    }

    updatePicUrl() {
        db.run('update picture set url = ? where command = ?', [this.newUrl, this.resourceName], (err) => {
            if (err) {
                msg.channel.send("An error occured. Error: " + err.Error);
            } else {
                msg.channel.send("Successfully changed the specified picture's url.");
            }
        });
    }

    updatePicName() {
        db.run('update picture set command = ? where url = ?', [this.name, this.newUrl], (err) => {
            if (err) { 
                msg.channel.send("An error occured. Error: " + err.Error);
            } else {
                msg.channel.send("Successfully changed pic name associated with specified url.");
            }
        });
    }
}

// Wrap cmdHandler function in this way such that it can be called by building a dynamically generated
// string of the function name in bot.js
let fnWrapper = [];
fnWrapper['cmdHandler'] = (msgInfo) => {
    // Extract resource name and url/full name from the following command types:
    // !update author [name|pic] [resource name] [url|full name]
    // !update pic [name|url] [resource name] [url]
    let fields = msgInfo.content.match(/^\s*\!update\s+(author|pic)\s+(name|pic|url)\s+([^\s]+)\s+([^\s]{1}.+)$/);

    if (fields === null) {
        utils.invalidUsage("!update", msgInfo.channel);
        return;
    }

    let update = fields[1] === "url" ? new Update(fields[1], fields[2], fields[3], fields[4], null) :
                                       new Update(fields[1], fields[2], fields[3], null, fields[4]);
    try {
        // Call appropriate class function dynamically - e.g. updatePicUrl
        update["update" + utils.titleCase(fields[1]) + utils.titleCase(fields[2])]();
    } catch (err) {
        utils.handleError(err, msgInfo.channel);
    }
}

module.exports = { fnWrapper };