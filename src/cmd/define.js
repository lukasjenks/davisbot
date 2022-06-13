const Discord = require('discord.js');
const utils = require('../lib/utils');
const axios = require("axios").default;

const defineTerm = (defNum, term, channel) => {
	
    let options = {
        method: 'GET',
        params: {term: term}
    };
    
    axios.get("https://api.urbandictionary.com/v0/define", options).then(response => {
		// Get given definition number and strip it of [] chars that go around links to other definitions
		let definition = response.data.list[defNum].definition.replace(/\[|\]/g, "");
		if (definition.length < 4000) {
			channel.send("```" + definition + "```");
		} else {
			channel.send("Definition for term is too long to be retrieved. Try retrieving the next most popular definition for your term (e.g. \"!define 2 linux\").");
		}
    }).catch(error => {
		console.error(error);
		channel.send("No definitions for the given term were found.");
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

	let defNum = fields[1] !== undefined ? fields[1] -1 : 0;
	let term = fields[2];

    defineTerm(defNum, term, msgInfo.channel);
}

module.exports = { cmdHandler };
