const Discord = require('discord.js');
const db = require('../lib/db');
const utils = require('../lib/utils');

class Update {
    constructor(subCmd, resourceType, resourceName, url=null, newName=null) {
        this.subCmd = subCmd;
        this.resourceType = resourceType ? resourceType.toLowerCase() : null;
        this.resourceName = resourceName ? resourceName.toLowerCase() : null;
        this.url = url;
        this.newName = newName;
    }

    // Done
    updateAuthorName(channel) {
        db.run('update author set full_name = ? where command = ?', [this.newName, this.resourceName], (err) => {
            if (err) {
                channel.send("An error occured. Error: " + err);
            } else {
                channel.send("Successfully changed the author's full name.");
            }
        });
    }

    // 
    updateAuthorPic(channel) {
        db.run('update author set picture_url = ? where command = ?', [this.url, this.resourceName], (err) => {
            if (err) {
                channel.send("An error occured. Error: " + err.Error);
            } else {
                channel.send("Successfully changed the author's picture.");
            }
        });
    }

    updatePicUrl(channel) {
        db.run('update picture set url = ? where command = ?', [this.url, this.resourceName], (err) => {
            if (err) {
                channel.send("An error occured. Error: " + err.Error);
            } else {
                channel.send("Successfully changed the specified picture's url.");
            }
        });
    }

    updatePicName(channel) {
        db.run('update picture set command = ? where url = ?', [this.newName, this.url], (err) => {
            if (err) { 
                channel.send("An error occured. Error: " + err.Error);
            } else {
                channel.send("Successfully changed pic name associated with specified url.");
            }
        });
    }
}

// Wrap cmdHandler function in this way such that it can be called by building a dynamically generated
// string of the function name in bot.js
const cmdHandler = (msgInfo) => {
    // Extract resource name and url/full name from the following command types:
    // !update author [name|pic] [resource name] [url|full name]
    // !update pic [name|url] [resource name] [url]

    // constructor(subCmd, resourceType, command, url, newName) {

    let fields = null;
    switch(msgInfo.msgArr[1]) {
        case "author":
            switch(msgInfo.msgArr[2]) {
                case "name":
                    fields = msgInfo.content.match(msgInfo.regex.updateAuthorNameCmd);
                    break;
                case "pic":
                    fields = msgInfo.content.match(msgInfo.regex.updateAuthorPicCmd);
                    break;
                default:
                    break;
            }
            break;
        case "pic":
            fields = msgInfo.content.match(msgInfo.regex.updatePicCmd);
            break;
        default:
            break;
    }

    if (fields !== null) {
        let update = fields[2] === "pic" ? new Update(fields[1], fields[2], fields[3], fields[4], null) :
                                        new Update(fields[1], fields[2], fields[3], null, fields[4]);

        // Call appropriate class function dynamically - e.g. updatePicUrl
        update["update" + utils.titleCase(fields[1]) + utils.titleCase(fields[2])](msgInfo.channel);
    } else {
        utils.invalidUsage("!update", msgInfo.channel);
    }
}

module.exports = { cmdHandler };
