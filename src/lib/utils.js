const Discord = require('discord.js');

module.exports = {
    usageMessage: function (channel) {
        const embed = new Discord.MessageEmbed()
            .setTitle("Available Commands")
            .addField("Help", "!help => get this usage message.", true)
            .addField("Quoting", "!quote author [name] => quote a given person with entries in the DB. (author can be replaced with 'random')\n\n!quote add [name] [topic] [quote] => add a quote attributed to a given person.\n\n!author add [name] [picture_url] [full_name] => add a new author of quotes\n\n!author list => names all authors that exist in the DB.", true)
            .addField("Pictures", "!pic show [name] => retrieve the picture with the given name. (show can be replaced with 'random')\n\n!pic add [name] [url] => add a new picture to the DB to be called later with !pic\n\n!pic list => lists all pictures that exist in the DB.", true)
			.addField("Ascii Art", "!ascii [phrase] => print out the given phrase in ascii art.", true)
			.addField("Emoji Multiplier", "[emoji] * [number] => print out the given emoji [number] times.", true)
            .addField("Updates", "!update author [pic|name] [resource name] [url|full name]\n\n!update pic [name|url] [resource name] [name|url]", true)
            .setColor('#f50057');
        channel.send({ embeds: [embed] });
    },

    invalidUsage: function (cmd, channel) {
        channel.send("Invalid usage of the (valid) " + cmd + " command.");
        this.usageMessage(channel);
    },

    multiplyEmote: function (msg) {
        // Extract emote used and number of times to multiply emote with regex
        let emoteAndNum = msg.content.match(/^\s*(:\w:)\s+\*([0-9]+)\s*$/);
        let emoteString = "";
        for (let i=0; i<emoteAndNum[1]; i++) {
            emoteString += emoteAndNum[0];
        }
        msg.channel.send(emoteString);
    },

    replyToUser: function (msgInfo) {
        // check if we need to reply to msg
        
    },

    isDigit: function (char) {
        return !isNaN(parseInt(char));
    },

    /*
    Generic error handler.
    TODO: Add logging to log file, and structured error messages.
    */
    handleError: function (error, channel) {
        channel.send("An error occured. Error: " + error);
    },

    /*
    Simple function that capitalizes the first character of a string and returns result.
    */
    titleCase: function (string) {
        let stringArr = string.split('');
        stringArr[0] = stringArr[0].toUpperCase();
        return stringArr.join('');
    },

    getMsgInfo: function (msg, regex=null, client=null) {
        let msgArr = msg.content.split(/(\s+)/).filter( function(e) { return e.trim().length > 0; } );
        return {content: msg.content, channel: msg.channel, msgArr: msgArr, regex: regex, client: client};
    }
}
