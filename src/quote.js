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
                    if (messageArr[2] == 'random') {
                        this.fetchRandomQuote(msg);
                    } else {
                        this.fetchQuoteByAuthor(msg, messageArr[2]);
                    }
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
                if (messageArr.length >= 3 && messageArr[2].charAt(0) === '"') {
                    let subStr = msg.content.split(/"/)[1];
                    this.fetchQuoteBySubString(msg, subStr);
                } else {
                    msg.channel.send("Improper usage. Usage: !quote like \"quote substring here\"");
                }
                break;
            default:
                msg.channel.send("Invalid quote command. Use !help to view proper usage.");
                break;
        }
    },
    addQuote: function(msg, messageArr) {
        let command = messageArr[2];
        let topic = messageArr[3];
        let quote = msg.content.split(/"/)[1];
        db.get('select id from author where command = ?', [command], (err, authorRec) => {
            if (err) {
                msg.channel.send("An error occured. Usage: !quoteadd [author] [topic] \"[quote]\". Error: " + err.Error);
            } else if (authorRec !== undefined) {
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
        if (name === "random") {
            this.fetchRandomQuote(msg);
        } else {
            db.get(`select content from quote where authorid = (select id from author where command = ?) order by RANDOM()`, [name], (err, quoteRec) => {
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
        }
    },
    fetchQuoteByTopic: function(msg, topic) {
        db.get(`select authorid, content from quote where topic = ? order by random() limit 1`, [topic], (err, quoteRec) => {
            if (err) {
                msg.channel.send("An error has occured while retrieving the quote. Error: " + err.Error);
            } else if (quoteRec !== undefined) {
                db.get('select full_name, picture_url from author where id = ?', [quoteRec.authorid], (err, authorRec) => {
                    if (err) {
                        msg.channel.send("An error occured. Usage: !quote about [topic]. Error: " + err.Error);
                    } else if (authorRec !== undefined) {
                        const embed = new Discord.RichEmbed()
                            .setDescription(quoteRec.content)
                            .setAuthor(authorRec.full_name, authorRec.picture_url)
                            .setColor('#f50057');
                        msg.channel.send(embed);
                    } else {
                        msg.channel.send("An unexpected error has occured: the author of the quote retrieved was not found in the DB.");
                    }
                })
            } else {
                msg.channel.send
            }
        });
    },
    fetchRandomQuote: function(msg) {
        db.get(`select authorid, content from quote order by RANDOM()`, (err, quoteRec) => {
            if (err) {
                msg.channel.send("A error has occured while retrieving the quote. Error: " + err.Error);
            } else if (quoteRec !== undefined) {
                db.get('select full_name, picture_url from author where id = ?', [quoteRec.authorid], (err, authorRec) => {
                    if (err) {
                        msg.channel.send("An error occured. Usage: !quote author [name]. Error: " + err.Error);
                    } else if (authorRec !== undefined) {
                        const embed = new Discord.RichEmbed()
                            .setDescription(quoteRec.content)
                            .setAuthor(authorRec.full_name, authorRec.picture_url)
                            .setColor('#f50057');
                        msg.channel.send(embed);
                    } else {
                        msg.channel.send("An unexpected error has occured: the author of the quote retrieved was not found in the DB.");
                    }
                });
            } else {
                msg.channel.send("No quotes found in the DB.");
            }
        });
    },
    fetchQuoteBySubString: function (msg, subStr) {
        db.get('select authorid, content from quote where content like ? order by random() limit 1', '%' + subStr + '%', (err, quoteRec) => {
            if (err) {
                msg.channel.send("An error occured. Usage: !quote like \"quote substring here\". Error: " + err.Error);
            } else if (quoteRec !== undefined) {
                db.get('select full_name, picture_url from author where id = ?', quoteRec.authorid, (err, authorRec) => {
                    if (err) {
                        msg.channel.send("An error occured. Usage: !quote like \"quote substring here\". Error: " + err.Error);
                    } else if (authorRec !== undefined) {
                        const embed = new Discord.RichEmbed()
                            .setDescription(quoteRec.content)
                            .setAuthor(authorRec.full_name, authorRec.picture_url)
                            .setColor('#f50057');
                        msg.channel.send(embed);
                    } else {
                        msg.channel.send("An unexpected error occured; The author associated with the quote to be retrieved was not found in the DB.");
                    }
                })
            } else {
                msg.channel.send("No quote which contains the substring specified was found in the DB.");
            }
        });
    }
}
