const Discord = require('discord.js');

module.exports = {
    helpCommand: function(msg) {
        const embed = new Discord.RichEmbed()
        .setTitle("Available Commands")
        .addField("Help", "!help => get this usage message.", true)
        .addField("Quoting", "!quote author [name] => quote a given person with entries in the DB. (author can be replaced with 'random')\n\n!quote add [name] [topic] \"[quote]\" => add a quote attributed to a given person.\n\n!author add [name] [picture_url] \"[full_name]\" => add a new author of quotes\n\n!author list => names all authors that exist in the DB.", true)
        .addField("Pictures", "!pic show [name] => retrieve the picture with the given name. (show can be replaced with 'random')\n\n!pic add [name] [url] => add a new picture to the DB to be called later with !pic\n\n!pic list => lists all pictures that exist in the DB.", true)
        .setColor('#f50057');
        msg.channel.send(embed);
    }
}
