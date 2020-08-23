const Discord = require('discord.js');
const sqlite3 = require('sqlite3').verbose();
const auth = require('./auth.json');
const token = auth.token;
const MIN_INTERVAL = 2 * 60 * 1000;

// open db
let db = new sqlite3.Database('bot.db', (err) => {
	if (err) {
		return console.error(err.message);
	}
	console.log('Connected to the DB.');
});

const client = new Discord.Client();

// Upon bot connection
client.on('ready', () => {
	console.log("Connected to Discord.");
	client.channels.get("596483849865658371").send("Bot is now connected.");
});

// Handle comands
client.on('message', (msg) => {

	if (msg.content.charAt(0) === '!') {

		var messageArr = msg.content.split(/(\s+)/).filter( function(e) { return e.trim().length > 0; } );

		// Put quoter functions here
		if (messageArr[0] === '!quote') {
			if (messageArr.length !== 2) {
				msg.channel.send("Improper usage. Usage: !quote [author]");
			} else {
				var command = messageArr[1];
				if (messageArr[1] === 'random') {
					db.get(`select * from quote order by RANDOM()`, (err, row1) => {
						if (err) {
							msg.channel.send("An error occured. Usage: !quote [author]. Error: " + err.Error);
						} else if (row1 !== undefined) {
							db.get('select * from author where id = ?', [row1.authorid], (err, row2) => {
								if (err) {
									msg.channel.send("An error occured. Usage: !quote [author]. Error: " + err.Error);
								} else if (row2 !== undefined) {
									const embed = new Discord.RichEmbed()
										.setDescription(row1.content)
										.setAuthor(row2.full_name, row2.picture_url)
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

				} else {
						db.get(`select * from quote where authorid = (select id from author where command = ?) order by RANDOM()`, [command], (err, row1) => {
							if (err) {
								msg.channel.send("An error occured. Usage: !quote [author]. Error: " + err.Error);
							} else if (row1 !== undefined) {
								db.get('select * from author where command = ?', [command], (err, row2) => {
									if (err) {
										msg.channel.send("An error occured. Usage: !quote [author]. Error: " + err.Error);
									} else if (row2 !== undefined) {
										const embed = new Discord.RichEmbed()
											.setDescription(row1.content)
											.setAuthor(row2.full_name, row2.picture_url)
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
			}

		} else if (messageArr[0] === '!quoteabout') {
			if (messageArr.length !== 2) {
				msg.channel.send("Improper usage. Usage: !quoteabout [topic]");
			} else {
				db.all('select * from quote where topic = ?', messageArr[1], (err, rows) => {
					if (err) {
						msg.channel.send("An error occured. Usage: !quoteabout [topic]. Error: " + err.Error);
					} else {
						if (rows.length > 0) {
							var row1 = rows[Math.floor(Math.random() * rows.length)];
							db.get('select * from author where id = ?', row1.authorid, (err, row2) => {
								if (err) {
									msg.channel.send("An error occured. Usage: !quoteabout [topic]. Error: " + err.Error);
								} else {
									if (row2 !== undefined) {
										const embed = new Discord.RichEmbed()
											.setDescription(row1.content)
											.setAuthor(row2.full_name, row2.picture_url)
											.setColor('#f50057');
										msg.channel.send(embed);
									} else {
										msg.channel.send("An error occured. Usage: !quoteabout [topic].");
									}
								}
							});
						} else {
							msg.channel.send("No quotes pertaining to that topic were found in the DB.")
						}
					}
				});
			}

		} else if (messageArr[0] === '!quotelike') {
			if (messageArr.length < 2 || messageArr[1].charAt(0) !== '"') {
				msg.channel.send("Improper usage. Usage: !quotelike \"quote substring here\"");
			} else {
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

		} else if (messageArr[0] === '!quoteadd') {
			if (messageArr.length < 4 || messageArr[3].charAt(0) !== '"') {
				msg.channel.send("Improper usage. Usage: !quoteadd [author] [topic] \"[quote]\"");
			} else {
				var command = messageArr[1];
				var topic = messageArr[2];
				var quote = msg.content.split(/"/)[1];
				db.get('select * from author where command = ?', [command], (err, row1) => {
					if (err) {
						msg.channel.send("An error occured. Usage: !quoteadd [author] [topic] \"[quote]\". Error: " + err.Error);
					} else if (row1 !== undefined) {
						db.run('insert into quote (authorid, topic, content) values (?, ?, ?)', [row1.id, topic, quote], (err) => {
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
			}

		} else if (messageArr[0] === '!authoradd') {
			if (messageArr.length < 4 || messageArr[3].charAt(0) !== '"') {
				msg.channel.send("Improper usage. Usage: !authoradd [name] [picture url] \"[full_name]\"");
			} else {
				var command = messageArr[1];
				var pictureUrl = messageArr[2];
				var fullName = msg.content.split(/"/)[1];
				db.run('insert into author (command, full_name, picture_url) values (?, ?, ?)', [command, fullName, pictureUrl], (err) => {
					if (err) {
						msg.channel.send("An error occured. Usage: !authoradd [name] [picture url] \"[full name]\". Error: " + err.Error);
						console.log(err);
					} else {
						msg.channel.send("Successfully added author to DB. Quotes can now be added for this author.");
					}
				});
			}

		} else if (messageArr[0] === '!pic') {
			if (messageArr.length !== 2) {
				msg.channel.send("Improper usage. Usage: !pic [picture name]");
			} else {
				var command = messageArr[1];
				if (messageArr[1] === 'random') {
					db.get('select * from picture', (err, row) => {
						if (err) {
							msg.channel.send("An error occured. Usage: !pic [picture name]. Error: " + err.Error);
						} else if (row !== undefined){
							msg.channel.send(row.url);
						} else {
							msg.channel.send("No images found in the DB.");
						}
					});
				} else {
					db.get('select * from picture where command = ?', [command], (err, row) => {
						if (err) {
							msg.channel.send("An error occured. Usage: !pic [picture name]. Error: " + err.Error);
						} else if (row !== undefined) {
							msg.channel.send(row.url);
						} else {
							msg.channel.send("Picture/gif named not found in the DB.");
						}
					});
				}
			}

		} else if (messageArr[0] === '!piclike') {
			if (messageArr.length !== 2) {
				msg.channel.send("Improper usage. Usage: !piclike [picture name]");
			} else {
				var command = messageArr[1];
				db.get ('select * from picture where command like ?', '%' + command + '%', (err, row) => {
					if (err) {
						msg.channel.send("An error occured. Usage: !piclike [picture name substring]. Error: " + err.Error);
					} else if (row !== undefined) {
						msg.channel.send(row.url);
					} else {
						msg.channel.send("No picture with a name similar to what was given was found in the DB.");
					}
				});
			}

		} else if (messageArr[0] === '!picadd') {
			if (messageArr.length !== 3) {
				msg.channel.send("Improper usage. Usage: !picadd [name] [picture url]");
			} else {
				var command = messageArr[1];
				var pictureUrl = messageArr[2];
				db.run('insert into picture (command, url) values (?, ?)', [command, pictureUrl], (err) => {
					if (err) {
						msg.channel.send("An error occured. Usage: !picadd [name] [picture url]. Error: " + err.Error);
					} else {
						msg.channel.send("Successfully added picture/gif to DB.");
					}
				});
			}

		} else if (msg.content === '!help') {

			const embed = new Discord.RichEmbed()
				.setTitle("Available Commands")
				.addField("Help", "!help => get this usage message.", true)
				.addField("Quoting", "!quote [name] => quote a given person with entries in the DB. (name can be set to 'random')\n\n!quoteadd [name] [topic] \"[quote]\" => add a quote attributed to a given person.\n\n!authoradd [name] [picture_url] \"[full_name]\" => add a new author of quotes\n\n!authorlist => names all authors that exist in the DB.", true)
				.addField("Pictures", "!pic [name] => retrieve the picture with the given name. (name can be set to 'random')\n\n!picadd [name] [url] => add a new picture to the DB to be called later with !pic\n\n!piclist => lists all pictures that exist in the DB.", true)
				.setColor('#f50057');
			msg.channel.send(embed);

		// List commands
		} else if (msg.content === '!piclist') {
			db.all(`select command from picture order by command`, [], (err, rows) => {
				if (err) {
					msg.channel.send("An error occured. Error: " + err.Error);
				} else {
					let message = "Available Pictures/GIFs in DB:\n";
					rows.forEach((row) => {
						message = message + row.command + "\n";
					});
					msg.channel.send(message);
				}
			});


		} else if (msg.content === '!authorlist') {
			db.all(`select command from author order by command`, [], (err, rows) => {
				if (err) {
					msg.channel.send("An error occured. Error: " + err.Error);
				} else {
					let message = "Available Authors in DB:\n";
					rows.forEach((row) => {
						message = message + row.command + "\n";
					});
					msg.channel.send(message);
				}
			});
		}

	// Processing to find words within commands to respond to
	} else {
		var messageArr = msg.content.split(/(\s+)/).filter( function(e) { return e.trim().length > 0; } );
		if (!msg.author.bot) {
			// Here, you can check to see if msg.content.indexOf("custom string") returns > -1 to check for something
			// that was said by a user, or msg.author.id to determine the author of the message
			// and then take the desired action based on this. Lots of potential for fun stuff here.
			msg.content = msg.content.toLowerCase();
		}
	}
});

client.login(token);
