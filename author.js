module.exports = {
    authorCommand: function(msg, messageArr) {
        switch (messageArr[1]) {
            case "add":
                if (messageArr.length >= 5 && messageArr[4].charAt(0) !== '"') {
                    this.addAuthor(msg, messageArr);
                } else {
                    msg.channel.send("Improper usage. Usage: !authoradd [name] [picture url] \"[full_name]\"");
                }
                break;
            case "list":
                this.listAuthors(msg);
            default:
                break;
        }
    },
    addAuthor: function(msg, messageArr) {
        var command = messageArr[2];
        var pictureUrl = messageArr[3];
        var fullName = msg.content.split(/"/)[1];
        db.run('insert into author (command, full_name, picture_url) values (?, ?, ?)', [command, fullName, pictureUrl], (err) => {
            if (err) {
                msg.channel.send("An error occured. Usage: !authoradd [name] [picture url] \"[full name]\". Error: " + err.Error);
                console.log(err);
            } else {
                msg.channel.send("Successfully added author to DB. Quotes can now be added for this author.");
            }
        });
    },
    listAuthors: function(msg) {
        db.all(`select command from author order by command`, [], (err, authorRecs) => {
            if (err) {
                msg.channel.send("An error occured. Error: " + err.Error);
            } else {
                let message = "Available Authors in DB:\n";
                authorRecs.forEach((authorRec) => {
                    message = message + authorRec.command + "\n";
                });
                msg.channel.send(message);
            }
        });
    }
}