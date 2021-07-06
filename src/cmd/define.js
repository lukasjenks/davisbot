const Discord = require('discord.js');
const utils = require('../lib/utils');
const axios = require("axios").default;

const defineTerm = (term, channel) => {

    let options = {
        method: 'GET',
        params: {term: term}
    };
    
    axios.get("https://api.urbandictionary.com/v0/define", options).then(response => {
        channel.send(response.data.list[0].definition.replace(/\[|\]/g, ""));
    }).catch(error => {
        if (error === "TypeError: Cannot read property 'definition' of undefined") {
            channel.send("No definitions found.");
        } else {
            channel.send("An error occured retrieving the definition: " + error);
        }
    });
}

// Wrap cmdHandler function in this way such that it can be called by building a dynamically generated
// string of the function name in bot.js
const cmdHandler = (msgInfo) => {
    // Extract with regex
    // !define [term]
    fields = msgInfo.content.match(msgInfo.regex.defineCmd);
    
    if (fields === null) {
        utils.invalidUsage("!define", msgInfo.channel);
        return;
    }

    defineTerm(fields[1], msgInfo.channel);
}

module.exports = { cmdHandler };
