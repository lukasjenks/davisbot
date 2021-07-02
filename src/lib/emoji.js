let containsEmoji = (emoji, regex) => {
    return regex.emojiPattern.test(emoji);
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

    if (msgToSend.length > 2000) {
      channel.send("Character limit exceeded.");
    } else {
      channel.send(msgToSend);
    }
};

let multiply = (msgInfo, regex, client) => {
    // Check if msg content matches [emoji] * [num] or [num] * [emoji]

    let cmdInfo = null;
    if (cmdInfo = msgInfo.content.match(regex.leftEmoji)) {
        var emoji = cmdInfo[1];
        var n = parseInt(cmdInfo[3]);
    } else if (cmdInfo = msgInfo.content.match(regex.rightEmoji)){
        var emoji = cmdInfo[3];
        var n = parseInt(cmdInfo[1]);
    }

    if (containsEmoji(emoji, regex) || isServerEmoji(emoji, regex, client)) {
        sendEmojiNTimes(emoji, n, msgInfo.channel);
    }
};

exports.multiply = multiply;