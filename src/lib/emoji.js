const regex = require('../cfg/regex.json');
const utils = require('./utils');

let containsEmoji = (msgString) => {
  let emojiPattern = Buffer.from(regex.genericEmojiBase64, 'base64').toString();
  return new RegExp(emojiPattern).test(msgString);
}

let isServerEmoji = (emoji, client) => {
  if (/^<:.{1,}:[0-9]{1,}>$/.test(emoji)) { // test if it matches custom emoji regex
    let emojiId = emoji.match(/[0-9]{1,}/)[0];
    if (client.emojis.find((value) => value.id == emojiId)) {
      return true;
    }
    return false;
  }
  return false;
}

let sendEmojiNTimes = (emoji, n, channel) => {
  let total = "";

  for (let i = 0; i < n; i++) {
    total += emoji;
  }

  if (total.length <= 4000) { //emojis actually are double in size aka 2000 emojis == 4000 characters
    channel.send(total);
  } else {
    channel.send("Character limit of 2000 exceeded.");
  }
}

let multiply = (msgInfo, client) => {
  let splitStar = msgInfo.content.split("*"); // better way of checking if the * character exists since we will use the array anyways
  if (splitStar.length > 1) {
    let left = splitStar[0].trim().split(" ");
    let right = splitStar[1].trim().split(" ");

    if ((containsEmoji(right[0]) || isServerEmoji(right[0], client)) && utils.isDigit(left[left.length - 1])) {
      sendEmojiNTimes(right[0], parseInt(left[left.length - 1]), msgInfo.channel);
    } else if ((containsEmoji(left[left.length - 1]) || isServerEmoji(left[left.length - 1], client)) && utils.isDigit(right[0])) {
      sendEmojiNTimes(left[left.length - 1], parseInt(right[0]), msgInfo.channel);
    }
  }
}

exports.multiply = multiply;