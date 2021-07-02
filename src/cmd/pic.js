const db = require('../lib/db');
const Discord = require('discord.js');
const utils = require('../lib/utils');

class Pic {

    constructor(subCmd, name=null, url=null) {
        this.subCmd = subCmd;
        this.name = name ? name.toLowerCase() : null;
        this.url = url;
    }

    picAdd(channel) {
        db.run('insert into picture (command, url) values (?, ?)', [this.name, this.url], (err) => {
            if (err) {
                channel.send("An error occured. Usage: !pic add [name] [picture url]. Error: " + err.Error);
            } else {
                channel.send("Successfully added picture/gif to DB.");
            }
        });
    }

    picShow(channel) {
        if (this.subCmd === 'random') {
            db.get('select url from picture order by random() limit 1', (err, picRecord) => {
                if (err) {
                    msg.channel.send("An error occured. Usage: !pic show [picture name]. Error: " + err.Error);
                } else if (picRecord !== undefined) {
                    msg.channel.send(picRecord.url);
                } else {
                    msg.channel.send("No images found in the DB.");
                }
            });
        } else {
            db.get('select url from picture where command = ?', [this.name], (err, picRecord) => {
                if (err) {
                    channel.send("An error occured. Usage: !pic show [picture name]. Error: " + err.Error);
                } else if (picRecord !== undefined) {
                    channel.send(picRecord.url);
                } else {
                    channel.send("Picture/gif named not found in the DB.");
                }
            });
        }
    }

    picLike(channel) {
        db.get('select url from picture where command like ? order by random() limit 1', '%' + this.name + '%', (err, picRecord) => {
            if (err) {
                channel.send("An error occured. Usage: !pic like \"quote substring here\". Error: " + err.Error);
            } else if (picRecord !== undefined) {
                channel.send(picRecord.url);
            } else {
                channel.send("No pic which has a name containing the substring specified was found in the DB.");
            }
        });
    }

    picList(channel) {
        db.all(`select command from picture order by command`, [], (err, picRecs) => {
            if (err) {
                channel.send("An error occured. Error: " + err.Error);
            } else {
                let message = "Available Pictures/GIFs in DB:\n";
                picRecs.forEach((picRec) => {
                    message = message + picRec.command + "\n";
                });
                channel.send(message);
            }
        });
    }
}

const cmdHandler = (msgInfo) => {
    if (msgInfo.msgArr.length >= 2) {
        let fields = null;
        switch (msgInfo.msgArr[1]) {
            case "add": //4 args
                fields = msgInfo.content.match(msgInfo.regex.picAddCmd);
                break;
            case "like": //3 args
                fields = msgInfo.content.match(msgInfo.regex.picLikeCmd);
                break;
            case "list": //2 args
                fields = msgInfo.content.match(msgInfo.regex.picListCmd);
                break;
            case "show": //3 args
                fields = msgInfo.content.match(msgInfo.regex.picShowCmd);
                break;
            default:
                utils.invalidUsage("!pic", msgInfo.channel);
                break;
        }

        if (fields === null) {
            utils.invalidUsage("!pic", msgInfo.channel);
            return;
        }
        
        // Not included constructor args will default to null
        fields = fields.slice(1);
        let pic = new Pic(...fields); // slice as first element and last 2 elements are not extracted fields


        // Call appropriate class function dynamically - e.g. picAdd
        pic["pic" + utils.titleCase(fields[0])](msgInfo.channel);

    } else {
        utils.invalidUsage("!pic", msgInfo.channel);
    }
}

module.exports = { cmdHandler };
