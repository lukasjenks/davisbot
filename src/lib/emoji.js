class Emoji {
    constructor(emoji, multiplyBy) {
        this.emoji = emoji;
        this.multiplyBy = multiplyBy;
    }

    containsEmoji(genericEmojiRegex) {
        return genericEmojiRegex.test(this.emoji);
    }
    
    isServerEmoji(discordEmojiRegex, client) {
        let emojiFields = this.emoji.match(discordEmojiRegex);
        let emojiNum = emojiFields ? emojiFields[1] : null;
        if (emojiNum && client.emojis.find(value => value.id == emojiNum)) {
            return true;
        }
        return false;
    }
    
    sendEmojiNTimes(channel) {
        // Discord has 2000 character limit, depending on server emoji
        // tag length the number of characters varies
        let msgToSend = "";
        for (let i = 0; i < this.multiplyBy; i++) {
            msgToSend += this.emoji;
        }
    
        msgToSend.length > 2000 ? channel.send("Character limit exceeded.") : channel.send(msgToSend);
    };
}

const multiply = (msgInfo) => {
    // Check if msg content matches [emoji] * [num] or [num] * [emoji]

    let cmdInfo = null;
    let emoji = null;
    if (cmdInfo = msgInfo.content.match(msgInfo.regex.leftEmojiCmd)) {
        emoji = new Emoji(cmdInfo[1], parseInt(cmdInfo[2]));
    } else if (cmdInfo = msgInfo.content.match(msgInfo.regex.rightEmojiCmd)){
        emoji = new Emoji(cmdInfo[2], parseInt(cmdInfo[1]));
    }


    if (emoji.containsEmoji(msgInfo.regex.genericEmoji) || isServerEmoji(msgInfo.regex.discordEmoji)) {
        emoji.sendEmojiNTimes(msgInfo.channel);
    }
};

module.exports = { multiply };