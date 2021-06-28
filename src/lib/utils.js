const Discord = require('discord.js');

module.exports = {
    usageMessage: (msgInfo) => {
        const embed = new Discord.RichEmbed()
            .setTitle("Available Commands")
            .addField("Help", "!help => get this usage message.", true)
            .addField("Quoting", "!quote author [name] => quote a given person with entries in the DB. (author can be replaced with 'random')\n\n!quote add [name] [topic] \"[quote]\" => add a quote attributed to a given person.\n\n!author add [name] [picture_url] \"[full_name]\" => add a new author of quotes\n\n!author list => names all authors that exist in the DB.", true)
            .addField("Pictures", "!pic show [name] => retrieve the picture with the given name. (show can be replaced with 'random')\n\n!pic add [name] [url] => add a new picture to the DB to be called later with !pic\n\n!pic list => lists all pictures that exist in the DB.", true)
            .addField("Updates", "!update author \n\n")
            .setColor('#f50057');
        msgInfo.msg.channel.send(embed);
    },

    multiplyEmote: (msg) => {
        // Extract emote used and number of times to multiply emote with regex
        let emoteAndNum = msg.content.match(/^\s*(:\w:)\s+\*([0-9]+)\s*$/);
        let emoteString = "";
        for (let i=0; i<emoteAndNum[1]; i++) {
            emoteString += emoteAndNum[0];
        }
        msg.channel.send(emoteString);
    },

    replyToUser : (msgInfo) => {
        // check if we need to reply to msg
        
    },

    /*
    Generic error handler.
    TODO: Add logging to log file, and structured error messages.
    */
    handleError: (error, channel) => {
        channel.send("An error occured. Error: " + error);
    },

    /*
    Simple function that capitalizes the first character of a string and returns result.
    */
    titleCase: (string) => {
        let stringArr = string.split('');
        stringArr[0] = stringArr[0].toUpper();
        return stringArr.join('');
    }
}
