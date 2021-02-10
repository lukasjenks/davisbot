const db = require('./db');
const Discord = require('discord.js');

module.exports = {
    quoteCommand: function(msg, messageArr) {
        if (messageArr.length < 2) {
            msg.channel.send("Improper usage. Usage: !quote [cmd] [args]");
        }
    
        // Identify and respond to subcommands
        switch(messageArr[1]) {
            case "add":
                if (messageArr.length >= 4 && messageArr[3].charAt(0) === '"') {
                    this.addQuote(msg, messageArr);
                }
                break;
            case "author":
                if (messageArr.length === 3) {
                    this.fetchQuoteByAuthor(msg, messageArr[2]);
                } else {
                    msg.channel.send("Improper usage. Usage: !quote author [name]");
                }
                break;
            case "about":
                if (messageArr.length === 3) {
                    this.fetchQuoteByTopic(msg, messageArr[2]);
                } else {
                    msg.channel.send("Improper usage. Usage: !quote about [topic]");
                }
                break;
            case "like":
                if (messageArr.length >= 3 && messageArr[1].charAt(0) === '"') {
                    this.fetchQuoteBySubString(msg, messageArr[2]);
                } else {
                    msg.channel.send("Improper usage. Usage: !quotelike \"quote substring here\"");
                }
                break;
            case "random":
                this.fetchRandomQuote(msg);
                break;
            default:
                msg.channel.send("Invalid quote command. Use !help to view proper usage.");
                break;
        }
    },
    addQuote: function(msg, messageArr) {
        let command = messageArr[1];
        let topic = messageArr[2];
        let quote = msg.content.split(/"/)[1];
        db.get('select * from author where command = ?', [command], (err, authorRec) => {
            if (err) {
                msg.channel.send("An error occured. Usage: !quoteadd [author] [topic] \"[quote]\". Error: " + err.Error);
            } else if (row1 !== undefined) {
                db.run('insert into quote (authorid, topic, content) values (?, ?, ?)', [authorRec.id, topic, quote], (err) => {
                    if (err) {
                        msg.channel.send("An error occured. Usage: !quoteadd [author] [topic] \"[quote]\". Error: " + err.Error);
                    } else {
                        msg.channel.send("Successfully added quote to DB.");
                    }
                });
            } else {
                msg.channel.send("Author specified not found in the DB.");
            }
        });
    },
    fetchQuoteByAuthor: function(msg, name) {
        db.get(`select * from quote where authorid = (select id from author where command = ?) order by RANDOM()`, [name], (err, quoteRec) => {
            if (err) {
                msg.channel.send("An error occured. Usage: !quote [author]. Error: " + err.Error);
            } else if (quoteRec !== undefined) {
                db.get('select * from author where command = ?', [name], (err, authorRec) => {
                    if (err) {
                        msg.channel.send("An error occured. Usage: !quote [author]. Error: " + err.Error);
                    } else if (authorRec !== undefined) {
                        const embed = new Discord.RichEmbed()
                            .setDescription(quoteRec.content)
                            .setAuthor(authorRec.full_name, authorRec.picture_url)
                            .setColor('#f50057');
                        msg.channel.send(embed);
                    } else {
                        msg.channel.send("Author not found in the DB.");
                    }
                });
            } else {
                msg.channel.send("No quotes found for that author in the DB.");
            }
        });
    },
    fetchRandomQuote: function(msg) {
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
    },
    fetchQuoteBySubString: function (msg) {
        var subStr = msg.content.split(/"/)[1];
        db.all ('select * from quote where content like ?', '%' + subStr + '%', (err, rows) => {
            if (err) {
                msg.channel.send("An error occured. Usage: !quotelike \"quote substring here\". Error: " + err.Error);
            } else {
                if (rows.length > 0) {
                    var row1 = rows[Math.floor(Math.random() * rows.length)];
                    db.get('select * from author where id = ?', row1.authorid, (err, row2) => {
                        if (err) {
                            msg.channel.send("An error occured. Usage: !quotelike \"quote substring here\". Error: " + err.Error);
                        } else {
                            if (row2 !== undefined) {
                                const embed = new Discord.RichEmbed()
                                    .setDescription(row1.content)
                                    .setAuthor(row2.full_name, row2.picture_url)
                                    .setColor('#f50057');
                                msg.channel.send(embed);
                            } else {
                                msg.channel.send("An error occured. Usage: !quotelike \"quote substring here\"");
                            }
                        }
                    })
                } else {
                    msg.channel.send("No quote which contains the substring specified was found in the DB.");
                }
            }
        });
    }
}
