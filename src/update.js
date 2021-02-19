const Discord = require('discord.js');
const db = require('./db');

module.exports = {
    updateCommand: function(msg, messageArr) {
        switch(messageArr[1]) {
            case "author":
                if (messageArr.length >= 5) {
                    if (messageArr.length === 5 && messageArr[2] == 'picture') {
                        let authorName = messageArr[3];
                        let newPicture = messageArr[4];
                        this.updateAuthorPicture(msg, authorName, newPicture);
                    } else if (messageArr[2] == 'name') {
                        let authorName = messageArr[3];
                        let newFullName = msg.content.split(/"/)[1];
                        console.log(newFullName);
                        this.updateAuthorName(msg, authorName, newFullName);
                    }
                } else {
                    msg.channel.send("Improper usage. Usage: !update author [name/picture] [name] [\"Full Name\"/picture_url]")
                }
                break;
            case "quote":
                break;
            case "pic":
                if (messageArr.length === 4) {
                    let picName = messageArr[2];
                    let newPicUrl = messageArr[3];
                    this.updatePictureUrl(msg, picName, newPicUrl);
                    break;
                } else {
                    msg.channel.send("Improper usage. Usage: !update pic [picture_name] [picture_url]");
                }
                break;
        }
    },
    updateAuthorPicture: function(msg, authorName, newPicture) {
        db.run('update author set picture_url = ? where command = ?', [newPicture, authorName], (err) => {
            if (err) {
                msg.channel.send("An error occured. Usage: !update author picture [name] [picture url]. Error: " + err.Error);
            } else {
                msg.channel.send("Successfully changed the author's picture.");
            }
        });
    },
    updateAuthorName: function(msg, authorName, newFullName) {
        db.run('update author set full_name = ? where command = ?', [newFullName, authorName], (err) => {
            if (err) {
                msg.channel.send("An error occured. Usage: !update author name [name] [\"Full Name\"]. Error: " + err.Error);
            } else {
                msg.channel.send("Successfully changed the author's full name.");
            }
        });
    },
    updatePictureUrl: function(msg, picName, newPicUrl) {
        db.run('update picture set url = ? where command = ?', [newPicUrl, picName], (err) => {
            if (err) {
                msg.channel.send("An error occured. Usage: !update picture [name] [picture url]. Error: " + err.Error);
            } else {
                msg.channel.send("Successfully changed the specified picture.");
            }
        });
    }
};