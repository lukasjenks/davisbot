const db = require('../lib/db');
const Discord = require('discord.js');
const utils = require('../lib/utils');

class Quote {
    constructor(subCmd, author=null, topic=null, quote=null) {
        this.subCmd = subCmd;
        this.author = author ? author.toLowerCase() : null;
        this.topic = topic ? topic.toLowerCase() : null;
        this.quote = quote;
    }

    quoteAdd(channel) {
        db.get('select id from author where command = ?', [this.author], (err, authorRec) => {
            if (err) {
                channel.send("An error occured. Usage: !quoteadd [author] [topic] \"[quote]\". Error: " + err.Error);
            } else if (authorRec !== undefined) {
                db.run('insert into quote (author_id, topic, content) values (?, ?, ?)', [authorRec.id, this.topic, this.quote], (err) => {
                    if (err) {
                        channel.send("An error occured. Usage: !quoteadd [author] [topic] \"[quote]\". Error: " + err.Error);
                    } else {
                        channel.send("Successfully added quote to DB.");
                    }
                });
            } else {
                channel.send("Author specified not found in the DB.");
            }
        });
    }

    quoteAuthor(channel) {
        if (this.author === "random") {
            this.quoteRandom(channel);
        } else {
            db.get(`select content from quote where author_id = (select id from author where command = ?) order by RANDOM()`, [this.author], (err, quoteRec) => {
                if (err) {
                    channel.send("An error occured. Usage: !quote [author]. Error: " + err.Error);
                } else if (quoteRec !== undefined) {
                    db.get('select * from author where command = ?', [this.author], (err, authorRec) => {
                        if (err) {
                            channel.send("An error occured. Usage: !quote [author]. Error: " + err.Error);
                        } else if (authorRec !== undefined) {
                            const embed = new Discord.RichEmbed()
                                .setDescription(quoteRec.content)
                                .setAuthor(authorRec.full_name, authorRec.picture_url)
                                .setColor('#f50057');
                            channel.send(embed);
                        } else {
                            channel.send("Author not found in the DB.");
                        }
                    });
                } else {
                    channel.send("No quotes found for that author in the DB.");
                }
            });
        }
    }

    quoteAbout(channel) {
        db.get(`select author_id, content from quote where topic = ? order by random() limit 1`, [this.topic], (err, quoteRec) => {
            if (err) {
                channel.send("An error has occured while retrieving the quote. Error: " + err.Error);
            } else if (quoteRec !== undefined) {
                db.get('select full_name, picture_url from author where id = ?', [quoteRec.author_id], (err, authorRec) => {
                    if (err) {
                        channel.send("An error occured. Usage: !quote about [topic]. Error: " + err.Error);
                    } else if (authorRec !== undefined) {
                        const embed = new Discord.RichEmbed()
                            .setDescription(quoteRec.content)
                            .setAuthor(authorRec.full_name, authorRec.picture_url)
                            .setColor('#f50057');
                        channel.send(embed);
                    } else {
                        channel.send("An unexpected error has occured: the author of the quote retrieved was not found in the DB.");
                    }
                })
            } else {
                channel.send
            }
        });
    }

    quoteLike(channel) {
        db.get('select author_id, content from quote where content like ? order by random() limit 1', '%' + this.quote + '%', (err, quoteRec) => {
            if (err) {
                channel.send("An error occured. Usage: !quote like \"quote substring here\". Error: " + err.Error);
            } else if (quoteRec !== undefined) {
                db.get('select full_name, picture_url from author where id = ?', quoteRec.author_id, (err, authorRec) => {
                    if (err) {
                        msg.channel.send("An error occured. Usage: !quote like \"quote substring here\". Error: " + err.Error);
                    } else if (authorRec !== undefined) {
                        const embed = new Discord.RichEmbed()
                            .setDescription(quoteRec.content)
                            .setAuthor(authorRec.full_name, authorRec.picture_url)
                            .setColor('#f50057');
                        channel.send(embed);
                    } else {
                        channel.send("An unexpected error occured; The author associated with the quote to be retrieved was not found in the DB.");
                    }
                })
            } else {
                channel.send("No quote which contains the substring specified was found in the DB.");
            }
        });
    }

    // Helper function for quoteAuthor, not command bound function.
    quoteRandom(channel) {
        db.get(`select author_id, content from quote order by RANDOM()`, (err, quoteRec) => {
            if (err) {
                channel.send("A error has occured while retrieving the quote. Error: " + err.Error);
            } else if (quoteRec !== undefined) {
                db.get('select full_name, picture_url from author where id = ?', [quoteRec.author_id], (err, authorRec) => {
                    if (err) {
                        channel.send("An error occured. Usage: !quote author [name]. Error: " + err.Error);
                    } else if (authorRec !== undefined) {
                        const embed = new Discord.RichEmbed()
                            .setDescription(quoteRec.content)
                            .setAuthor(authorRec.full_name, authorRec.picture_url)
                            .setColor('#f50057');
                        channel.send(embed);
                    } else {
                        channel.send("An unexpected error has occured: the author of the quote retrieved was not found in the DB.");
                    }
                });
            } else {
                channel.send("No quotes found in the DB.");
            }
        });
    }
}

const cmdHandler = (msgInfo) => {
    if (msgInfo.msgArr.length >= 3) {
        let fields = null;
        // Identify and respond to subcommands
        switch(msgInfo.msgArr[1]) {
            case "add":
                // !quote add [authorname] [topic] [\"quote here\"]"
                fields = msgInfo.content.match(/^\s*\!quote\s+(add)\s+([^\s]+)\s+([^\s]+)\s+(.+)\s*$/);
                // constructor args: subCmd, author, topic, quote
                var quote = new Quote(fields[1], fields[2], fields[3], fields[4]);
                break;
            case "author":
                // !quote author [authorname]
                fields = msgInfo.content.match(/^\s*\!quote\s+(author)\s+([^\s]+)\s*$/);
                var quote = new Quote(fields[1], fields[2]);
                break;
            case "about":
                // !quote about [topic]
                fields = msgInfo.content.match(/^\s*\!quote\s+(about)\s+([^\s]+)\s*$/);
                var quote = new Quote(fields[1], null, fields[2]);
                break;
            case "like":
                // !quote like \"quote substring here\""
                fields = msgInfo.content.match(/^\s*\!quote\s+(like)\s+(.+)\s*$/);
                var quote = new Quote(fields[1], null, null, fields[2]);
                break;
            default:
                msg.channel.send("Invalid quote command. Use !help to view proper usage.");
                break;
        }

        if (fields !== null) {
            // Call appropriate class function dynamically - e.g. quoteAdd
            quote["quote" + utils.titleCase(fields[1])](msgInfo.channel);
        } else {
            utils.handleError(err, msgInfo.channel);
        }
    } else {
        utils.invalidUsage("!quote", msgInfo.channel);
    }
}

module.exports = { cmdHandler };