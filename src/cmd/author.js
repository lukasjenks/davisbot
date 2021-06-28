const db = require('./lib/db');
const Discord = require('discord.js');
const { utils } = require('./lib/utils');


let wrapper = [];
wrapper['cmdHandler'] = (msgInfo) => {
    switch (msgInfo.msgArr[1]) {
        case "add":
            if (msgInfo.msgArr.length >= 5) {
                this.addAuthor(msg, msgArr);
            } else {
                msg.channel.send("Improper usage (not enough arguments given). Usage: !authoradd [name] [picture url] [full_name]");
            }
            break;
        case "list":
            this.listAuthors(msgInfo.msg);
            break;
        default:
            msg.channel.send("Invalid subcommand used.");
            utils.usageMessage(msgInfo.msg);
            break;
    }
}

module.exports = { cmdHandler };