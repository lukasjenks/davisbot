const Discord = require('discord.js');
const utils = require('./utils');

module.exports = {
    cmdHandler: (msgInfo) => {
        utils.usageMessage(msgInfo);
    }
}