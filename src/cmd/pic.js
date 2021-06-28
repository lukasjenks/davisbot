const db = require('../lib/db');
const Discord = require('discord.js');
const utils = require('../lib/utils');

class Pic {

    constructor(subCmd, name, url) {
        this.subCmd = subCmd;
        this.name = name;
        this.url = url;
    }

    addPic () {
        db.run('insert into picture (command, url) values (?, ?)', [command, pictureUrl], (err) => {
            if (err) {
                msg.channel.send("An error occured. Usage: !pic add [name] [picture url]. Error: " + err.Error);
            } else {
                msg.channel.send("Successfully added picture/gif to DB.");
            }
        });
    }

    // done
    fetchPicByName () {
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
                    msg.channel.send("An error occured. Usage: !pic show [picture name]. Error: " + err.Error);
                } else if (picRecord !== undefined) {
                    msg.channel.send(picRecord.url);
                } else {
                    msg.channel.send("Picture/gif named not found in the DB.");
                }
            });
        }
    }

    fetchPicBySubString() {
        db.get('select url from picture where command like ? order by random() limit 1', '%' + subStr + '%', (err, picRecord) => {
            if (err) {
                msg.channel.send("An error occured. Usage: !pic like \"quote substring here\". Error: " + err.Error);
            } else if (picRecord !== undefined) {
                msg.channel.send(picRecord.url);
            } else {
                msg.channel.send("No pic which has a name containing the substring specified was found in the DB.");
            }
        });
    }

    listPics() {
        db.all(`select command from picture order by command`, [], (err, picRecs) => {
            if (err) {
                msg.channel.send("An error occured. Error: " + err.Error);
            } else {
                let message = "Available Pictures/GIFs in DB:\n";
                picRecs.forEach((picRec) => {
                    message = message + picRec.command + "\n";
                });
                msg.channel.send(message);
            }
        });
    }
}

let fnWrapper = [];
fnWrapper["cmdHander"] = (msgInfo) => {
    if (msgInfo.msgArr.length >= 2) {
        let fields = null;
        switch (msgInfo.msgArr[1]) {
            case "add": //4 args
                fields = msgInfo.content.match(/^\s*\!pic\s+(add)\s+([^\s]+)\s+([^\s])\s*$/);
                break;
            case "like": //3 args
                fields = msgInfo.content.match(/^\s*\!pic\s+(like)\s+([^\s+])\s*$/);
                break;
            case "list": //2 args
                fields = msgInfo.content.match(/^\s*\!pic\s+(list)\s*$/);
                break;
            case "show": //3 args
                if (messageArr.length === 3) {
                    var command = messageArr[2];
                    this.fetchPicByName(msg, command);
                } else {
                    msg.channel.send("Improper usage. Usage: !pic show [name]");
                }
                break;
            default:
                break;
        }
    } else {
        utils.invalidUsage("!pic", msgInfo.channel);
    }
}