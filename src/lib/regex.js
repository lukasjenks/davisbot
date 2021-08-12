const largeRegex = require('../cfg/large-regex.json');

// Alphabetized by command
module.exports = 
{
	ascii: {
        validFiglet: new RegExp(/^[0-9a-zA-Z=!\?\s]+$/)
    },
	
    author: {
        authorAddCmd: new RegExp(/^\s*!author\s+(add)\s+([^\s]+)\s+([^\s]+)\s+([^\s]{1}.+[^\s]{1})$/),
        authorListCmd: new RegExp(/^\s*!author\s+(list)\s*$/)
    },
	
    emoji: {
        emojiCmd: new RegExp(/(?:^\s*[^\s]+\s*\*\s*[0-9]+\s*$)|(?:^\s*[0-9]+\s*\*\s*[^\s]+\s*$)/),
        leftEmojiCmd: new RegExp(/^\s*([^\s]+)\s*\*\s*([0-9]+)\s*$/),
        rightEmojiCmd: new RegExp(/^\s*([0-9]+)\s*\*\s*([^\s]+)\s*$/),
        genericEmoji: new RegExp(Buffer.from(largeRegex.genericEmojiBase64, "base64").toString()),
        discordEmoji: new RegExp(/^<:.+:([0-9]+)>$/)
    },

    define: {
        defineCmd: new RegExp(/^\s*!define\s+(?:(?:([0-9]*)\s+)|.{0})([^\s]{1}.*[^\s]{1})$/)
    },

    pic: {
        picAddCmd : new RegExp(/^\s*!pic\s+(add)\s+([^\s]+)\s+([^\s]+)\s*$/),
        picLikeCmd: new RegExp(/^\s*!pic\s+(like)\s+([^\s]+)\s*$/),
        picListCmd: new RegExp(/^\s*!pic\s+(list)\s*$/),
        picShowCmd: new RegExp(/^\s*!pic\s+(show)\s+([^\s]+)\s*$/)
    },

    quote: {
        quoteAddCmd: new RegExp(/^\s*!quote\s+(add)\s+([^\s]+)\s+([^\s]+)\s+([^\s]{1}.+[^\s]{1})$/),
        quoteAuthorCmd: new RegExp(/^\s*!quote\s+(author)\s+([^\s]+)\s*$/),
        quoteAboutCmd: new RegExp(/^\s*!quote\s+(about)\s+([^\s]+)\s*$/),
        quoteLikeCmd: new RegExp(/^\s*!quote\s+(like)\s+([^\s]{1}.+[^\s]{1})$/)
    },

	temp: {
		// !temp ([none]|now|tomorrow|next) ([none]|[day of week])
		tempCmd: new RegExp(/^\s*!temp(?:\s+|.{0})((?:now)|(?:tomorrow)|(?:next).{0})((?:monday)|(?:tuesday)|(?:wednesday)|(?:thursday)|(?:friday)|(?:saturday)|(?:sunday)|.{0})\s*$/)
	},

    update: {
        updateCmd: new RegExp(/^\s*!update\s+(author|pic)\s+(name|pic|url)\s+([^\s]+)\s+([^\s]{1}.+[^\s]{1})$/),
        updatePicCmd: new RegExp(/^\s*!update\s+(pic)\s+(name|url)\s+([^\s]+)\s+([^\s]+)\s*$/),
        updateAuthorNameCmd: new RegExp(/^\s*!update\s+(author)\s+(name)\s+([^\s]+)\s+([^\s]{1}.+[^\s]{1})$/),
        updateAuthorPicCmd: new RegExp(/^\s*!update\s+(author)\s+(pic)\s+([^\s]+)\s+([^\s]+)\s*$/)
    }
}
