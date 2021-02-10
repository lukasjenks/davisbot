

let db = {
    DB: new sqlite3.Database('bot.db', (err) => {
	    if (err) {
		    return console.error(err.message);
	    }
	    console.log('Connected to the DB.');
    })

module.exports = db;
