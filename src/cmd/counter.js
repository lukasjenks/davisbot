const Discord = require("discord.js");
const db = require("../lib/db");
const utils = require("../lib/utils");

class Counter {
    constructor(subCmd, tag = null, arg3 = null) {
        this.subCmd = subCmd;
        this.tag = tag ? tag.toLowerCase() : null;

        if (subCmd === "add") {
            this.description = arg3;
        } else if (subCmd === "set") {
            this.count = parseInt(arg3, 10);
        }
    }

    counterAdd(channel) {
        db.run(
            "insert into counter (tag, description, count) values (?, ?, 0)",
            [this.tag, this.description],
            (err) => {
                if (err) {
                    channel.send(
                        'An error occured. Usage: !counteradd [tag] [description]". Error: ' +
                            err
                    );
                    console.log(err);
                } else {
                    channel.send(
                        "Successfully added counter to DB. The counter can now be incremented."
                    );
                }
            }
        );
    }

    counterList(channel) {
        db.all(
            `select tag, description, count from counter order by tag`,
            [],
            (err, counterRecs) => {
                if (err) {
                    channel.send("An error occured. Error: " + err);
                } else {
                    let embed = new Discord.MessageEmbed()
                        .setTitle("Available Counters:")
                        .setColor("#f50057");

                    for (const counterRec of counterRecs) {
                        embed = embed.addField(
                            `Tag: ${counterRec.tag}`,
                            `Count: ${counterRec.count}\tDescription: ${counterRec.description}`
                        );
                    }
                    channel.send({ embeds: [embed] });
                }
            }
        );
    }

    counterIncrement(channel) {
        db.get(
            "select count from counter where tag = ?",
            [this.tag],
            (err, counterRec) => {
                if (err) {
                    channel.send(
                        "An error occurred. Usage: !counterincrement [tag]. Error: " +
                            err
                    );
                    console.log(err);
                    return;
                }

                if (!counterRec) {
                    channel.send(
                        `No counter found for tag "${this.tag}". Use !counter add to create one.`
                    );
                    return;
                }

                const newCount = counterRec.count + 1;

                db.run(
                    "update counter set count = ? where tag = ?",
                    [newCount, this.tag],
                    (err) => {
                        if (err) {
                            channel.send(
                                "An error occurred while incrementing. Error: " +
                                    err
                            );
                            console.log(err);
                        } else {
                            channel.send(
                                `Successfully incremented counter. Count is: ${newCount}.`
                            );
                        }
                    }
                );
            }
        );
    }

    counterSet(channel) {
        if (typeof this.count !== "number" || isNaN(this.count)) {
            channel.send(
                "Invalid count provided. Usage: !counter set [tag] [count]"
            );
            return;
        }

        db.run(
            "update counter set count = ? where tag = ?",
            [this.count, this.tag],
            (err) => {
                if (err) {
                    channel.send(
                        "An error occurred. Usage: !counterset [tag] [count]. Error: " +
                            err
                    );
                    console.log(err);
                } else {
                    channel.send(
                        `Successfully set counter. Count is now: ${this.count}.`
                    );
                }
            }
        );
    }
}

// Wrap cmdHandler function in this way such that it can be called by building a dynamically generated
// string of the function name in bot.js
const cmdHandler = (msgInfo) => {
    // Extract with regex
    // !counter list
    // !counter add [tag] [description]
    // !counter increment [tag]
    let fields = null;
    switch (msgInfo.msgArr[1]) {
        case "add":
            fields = msgInfo.content.match(msgInfo.regex.counterAddCmd);
            break;
        case "list":
            fields = msgInfo.content.match(msgInfo.regex.counterListCmd);
            break;
        case "increment":
            fields = msgInfo.content.match(msgInfo.regex.counterIncrementCmd);
            break;
        case "set":
            fields = msgInfo.content.match(msgInfo.regex.counterSetCmd);
            break;
        default:
            break;
    }

    if (fields === null) {
        utils.invalidUsage("!counter", msgInfo.channel);
        return;
    }

    // Captured fields in the result of match start at index 1
    fields = fields.slice(1);
    let counter = new Counter(...fields);

    // Call appropriate class function dynamically - e.g. picAdd
    counter["counter" + utils.titleCase(fields[0])](msgInfo.channel);
};

module.exports = { cmdHandler };
