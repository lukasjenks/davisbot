const db = require('./db');
const Discord = require('discord.js');

module.exports = {
    picCommand: function(msg, messageArr) {
        switch (messageArr[1]) {
            case "add":
                if (messageArr.length === 4) {
                    this.addPic(msg, messageArr);
                } else {
                    msg.channel.send("Improper usage. Usage: !authoradd [name] [picture url] \"[full_name]\"");
                }
                break;
            case "like":
                if (messageArr.length >= 3 && messageArr[2].charAt(0) === '"') {
                    this.fetchPicBySubString(msg, messageArr[2]);
                } else {
                    msg.channel.send("Improper usage. Usage: !quote like \"quote substring here\"");
                }
                break;
            case "list":
                this.listPics(msg);
                break;
            case "show":
                if (messageArr.length === 3) {
                    this.fetchPicByName(msg, messageArr);
                } else {
                    msg.channel.send("Improper usage. Usage: !pic show [picture name]");
                }
                break;
            default:
                break;
        }
    },
    addPic: function(msg, messageArr) {
        if (messageArr.length !== 4) {
            msg.channel.send("Improper usage. Usage: !pic add [name] [picture url]");
        } else {
            var command = messageArr[2];
            var pictureUrl = messageArr[3];
            db.run('insert into picture (command, url) values (?, ?)', [command, pictureUrl], (err) => {
                if (err) {
                    msg.channel.send("An error occured. Usage: !picadd [name] [picture url]. Error: " + err.Error);
                } else {
                    msg.channel.send("Successfully added picture/gif to DB.");
                }
            });
            /*
            .catch((err) => {
                msg.channel.send(`Error inserting picture into DB: Error: ${err}`);
            })
            */
        }
    },
    fetchPicByName: function(msg, messageArr) {
        var command = messageArr[2];
        if (command === 'random') {
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
            db.get('select url from picture where command = ?', [command], (err, picRecord) => {
                if (err) {
                    msg.channel.send("An error occured. Usage: !pic show [picture name]. Error: " + err.Error);
                } else if (picRecord !== undefined) {
                    msg.channel.send(picRecord.url);
                } else {
                    msg.channel.send("Picture/gif named not found in the DB.");
                }
            });
        }
    },
    fetchPicBySubString: function(msg) {
        var subStr = msg.content.split(/"/)[1];
        db.get('select url from picture where command like ? order by random() limit 1', '%' + subStr + '%', (err, picRecord) => {
            if (err) {
                msg.channel.send("An error occured. Usage: !quotelike \"quote substring here\". Error: " + err.Error);
            } else if (picRecord !== undefined) {
                msg.channel.send(picRecord.url);
            } else {
                msg.channel.send("No quote which contains the substring specified was found in the DB.");
            }
        });
    },
    listPics: function(msg) {
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
