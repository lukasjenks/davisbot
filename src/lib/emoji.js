let containsEmoji = (emoji, regex) => {
    return regex.genericEmoji.test(emoji);
};

let isServerEmoji = (emoji, regex, client) => {
    let emojiFields = emoji.match(regex.discordEmoji);
    let emojiNum = emojiFields ? emojiFields[1] : null;
    if (emojiNum && client.emojis.find(value => value.id == emojiNum)) {
      return true;
    }
    return false;
};

let sendEmojiNTimes = (emoji, n, channel) => {
    // Discord has 2000 character limit, depending on server emoji
    // tag length the number of characters varies
    let msgToSend = "";
    for (let i = 0; i < n; i++) {
        msgToSend += emoji;
    }

	msgToSend.length > 2000 ? channel.send("Character limit exceeded.") : channel.send(msgToSend);
};

let multiply = (msgInfo) => {
    // Check if msg content matches [emoji] * [num] or [num] * [emoji]

    let cmdInfo = null;
    if (cmdInfo = msgInfo.content.match(msgInfo.regex.leftEmojiCmd)) {
        var emoji = cmdInfo[1];
        var n = parseInt(cmdInfo[2]);
    } else if (cmdInfo = msgInfo.content.match(msgInfo.regex.rightEmojiCmd)){
        var emoji = cmdInfo[2];
        var n = parseInt(cmdInfo[2]);
    }

    if (containsEmoji(emoji, msgInfo.regex) || isServerEmoji(emoji, msgInfo.regex, msgInfo.client)) {
        sendEmojiNTimes(emoji, n, msgInfo.channel);
    }
};

exports.multiply = multiply;