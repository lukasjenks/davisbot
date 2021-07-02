const Discord = require('discord.js');
const utils = require('../lib/utils');

cmdHandler = (msgInfo) => {
    utils.usageMessage(msgInfo);
}

module.exports = cmdHandler;