const Discord = require('discord.js');
const utils = require('../lib/utils');

let fnWrapper = [];
fnWrapper['cmdHandler'] = (msgInfo) => {
    utils.usageMessage(msgInfo);
}

module.exports = fnWrapper;