const regex = require('../cfg/regex.json');
const utils = require('./utils');

let containsEmoji = (msg) => {
  var emojiPattern = String.raw(regex.genericEmoji);
  return new RegExp(emojiPattern).test(msg);
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

let sendEmojiNTimes = (emoji, n, msg) => {
  let total = "";

  for (let i = 0; i < n; i++) {
    total += emoji;
  }

  if (total.length <= 4000) { //emojis actually are double in size aka 2000 emojis == 4000 characters
    msg.channel.send(total);
  } else {
    msg.channel.send("Character limit of 2000 exceeded.");
  }
}

let multiply = (msg, client) => {
  let splitStar = msg.content.split("*"); // better way of checking if the * character exists since we will use the array anyways
  if (splitStar.length > 1) {
    let left = splitStar[0].trim().split(" ");
    let right = splitStar[1].trim().split(" ");

    if ((containsEmoji(right[0]) || isServerEmoji(right[0], client)) && utils.isDigit(left[left.length - 1])) {
      sendEmojiNTimes(right[0], parseInt(left[left.length - 1]), msg);
    } else if ((containsEmoji(left[left.length - 1]) || isServerEmoji(left[left.length - 1], client)) && utils.isDigit(right[0])) {
      sendEmojiNTimes(left[left.length - 1], parseInt(right[0]), msg);
    }
  }
}

exports.multiply = multiply;