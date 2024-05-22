const { Client, Intents } = require("discord.js");
const auth = require("./auth.json");
const token = auth.token;
const MIN_INTERVAL = 2 * 60 * 1000;

// Import cmd handlers
const quote = require("./src/cmd/quote");
const author = require("./src/cmd/author");
const birthday = require("./src/cmd/birthday");
const pic = require("./src/cmd/pic");
const update = require("./src/cmd/update");
const help = require("./src/cmd/help");
const ascii = require("./src/cmd/ascii");
const emoji = require("./src/lib/emoji");
const define = require("./src/cmd/define");
const temp = require("./src/cmd/temp");

const cmdModules = {
    quote,
    birthday,
    author,
    pic,
    update,
    help,
    ascii,
    define,
    temp,
};

const utils = require("./src/lib/utils");
const regex = require("./src/lib/regex"); // precompiled regex are faster than inline

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    ],
    partials: ["MESSAGE", "CHANNEL", "REACTION"],
});

client.login(token).catch((err) => {
    console.log("An error occured: " + err);
});

// Upon bot connection
client.on("ready", () => {
    console.log("Connected to Discord.");
    client.channels.cache
        .find((channel) => channel.name === "welcome")
        .send(
            "React with :hello_there: to toggle access to the #kenobi channel on. Replace your reaction with :old_ben: to toggle access off."
        );
    //client.channels.find("name","welcome").send("React with :hello_there: to toggle access to the #kenobi channel on. Replace your reaction with :old_ben: to toggle access off.");
});

// Handle comands
client.on("messageCreate", (msg) => {
    if (!msg.author.bot) {
        // Command mode
        if (msg.content.charAt(0) === "!") {
            let nameOfCmd = msg.content.split(" ")[0].trim().slice(1); // extract nameOfCmd from ![nameOfCmd] [arg]
            let msgInfo =
                nameOfCmd.length > 1
                    ? utils.getMsgInfo(msg, regex[nameOfCmd])
                    : null;
            // Call dynamically built func call; e.g. author.cmdHandler(msg); -> located in src/author.js
            if (cmdModules[nameOfCmd] && cmdModules[nameOfCmd]["cmdHandler"]) {
                cmdModules[nameOfCmd]["cmdHandler"](msgInfo);
            } else {
                msg.channel.send(
                    "Command not recognized. For a list of valid commands, use !help"
                );
            }
            // Emoji command mode: emoji command format: emoji * n || n * emoji
        } else if (regex.emoji.emojiCmd.test(msg.content)) {
            let msgInfo = utils.getMsgInfo(msg, regex["emoji"], client);
            emoji.multiply(msgInfo);
        }
    }
});

// Adding reaction-role function
client.on("messageReactionAdd", async (reaction, user) => {
    // Fetch "partials" to get full context ( required now in 2023 with intents changes )
    if (reaction.message.partial) await reaction.message.fetch();
    if (reaction.partial) await reaction.fetch();
    if (user.partial) await user.fetch();

    if (user.bot || !reaction.message.guild) return;

    if (reaction.message.content.includes("React with")) {
        let role = reaction.message.member.guild.roles.cache.find(
            (role) => role.name === "kenobi"
        );
        let member = reaction.message.member.guild.members.cache.get(user.id);
        if (reaction._emoji && reaction._emoji.name === "hello_there") {
            member.roles.add(role);
        } else if (reaction._emoji && reaction._emoji.name === "old_ben") {
            member.roles.remove(role);
        }
    }
});
