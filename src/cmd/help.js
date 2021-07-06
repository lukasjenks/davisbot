const Discord = require('discord.js');
const utils = require('../lib/utils');

const cmdHandler = (msgInfo) => {
    utils.usageMessage(msgInfo.channel);
}

module.exports = { cmdHandler };
