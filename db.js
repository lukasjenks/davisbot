const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('bot.db', (err) => {
    if (err) {
	return console.error(err.message);
    }
    console.log('Connected to the DB.');
});

module.exports = db;
