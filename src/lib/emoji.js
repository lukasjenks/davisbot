const utils = require("./utils");
const regex = require("../cfg/regex.json");

let containsEmoji = (emoji) => {
    let emojiPattern = Buffer.from(regex.genericEmojiBase64, "base64").toString();
    return new RegExp(emojiPattern).test(emoji);
};

let isServerEmoji = (emoji, client) => {
    let emojiFields = emoji.match(/^<:.+:([0-9]+)>$/);
    let emojiNum = emojiFields ? emojiFields[1] : null;
    if (emojiNum && client.emojis.find(value => value.id == emojiNum)) {
      return true;
    }
    return false;
};

let sendEmojiNTimes = (emoji, n, channel) => {
    // Standard emojis are double in size so 2000 emojis == 4000 characters
    // Server emojis are just characters that render as emoji so char count is sufficient
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

let multiply = (msgInfo, client) => {
    let params = msgInfo.content.match(/^\s*([^\s]+)\s*\*\s*([0-9]+)\s*$/);
    if (params !== null) {
        let emoji = params[1];
        let n = parseInt(params[2]);

        if (containsEmoji(emoji) || isServerEmoji(emoji, client)) {
          sendEmojiNTimes(emoji, n, msgInfo.channel);
        }
    }
};

exports.multiply = multiply;