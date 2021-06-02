# DAVIS (Bot)

## Summary

DAVIS is a multipurpose bot made with Node.js/sqlite3 and supports, among other things, persistent custom author (with picture) and custom quote storage and retrieval and persistent custom picture/GIF storage and retrieval.

Please note that this project was written some time ago and needs to be refactored/improved.

## Note

This bot has recently been rewritten and is currently undergoing maintenance and further development. Some previous features may not work as before as they are altered and additional features are added.

## Installation

To install Davis Bot, run the following (unix-like OS'):

```bash
git clone https://github.com/lukasjenks/davisbot.git davisbot
cd davisbot
npm install
touch bot.db
touch auth.json
# edit auth.json to contain your Discord bot's token as the value in a key value pair with the key "token"
# edit bot.js line 20 to use your server's specific channel ID
node bot.js
```
