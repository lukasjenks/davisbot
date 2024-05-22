const db = require("../lib/db");
const Discord = require("discord.js");
const utils = require("../lib/utils");

class Birthday {
    constructor(subCmd, userTag = null, birthday = null) {
        this.subCmd = subCmd;
        this.userTag = userTag;
        this.birthday = birthday;
    }

    birthdayAdd(channel) {
        db.run(
            "insert into birthdays (user_tag, birthday) values (?, ?)",
            [this.userTag, this.birthday],
            (err) => {
                if (err) {
                    channel.send(
                        "An error occurred. Usage: !birthday add @user [YYYY-MM-DD]. Error: " +
                            err.message
                    );
                } else {
                    channel.send(
                        `Successfully added ${this.userTag}'s birthday to the DB.`
                    );
                }
            }
        );
    }

    birthdayGet(channel) {
        db.get(
            "select birthday from birthdays where user_tag = ?",
            [this.userTag],
            (err, birthdayRec) => {
                if (err) {
                    channel.send(
                        "An error occurred. Usage: !birthday get @user. Error: " +
                            err.message
                    );
                } else if (birthdayRec !== undefined) {
                    channel.send(
                        `${this.userTag}'s birthday is on ${birthdayRec.birthday}.`
                    );
                } else {
                    channel.send(
                        `No birthday found for ${this.userTag} in the DB.`
                    );
                }
            }
        );
    }

    birthdayGetAll(channel) {
        db.all("select user_tag, birthday from birthdays", (err, rows) => {
            if (err) {
                channel.send(
                    "An error occurred while retrieving all birthdays. Error: " +
                        err.message
                );
            } else if (rows.length > 0) {
                const embed = new Discord.MessageEmbed()
                    .setTitle("Birthdays")
                    .setColor("#f50057");

                rows.forEach((row) => {
                    embed.addField(row.user_tag, row.birthday, true);
                });

                channel.send({ embeds: [embed] });
            } else {
                channel.send("No birthdays found in the DB.");
            }
        });
    }

    birthdayDelete(channel) {
        db.run(
            "delete from birthdays where user_tag = ?",
            [this.userTag],
            (err) => {
                if (err) {
                    channel.send(
                        "An error occurred. Usage: !birthday delete @user. Error: " +
                            err.message
                    );
                } else {
                    channel.send(
                        `Successfully deleted ${this.userTag}'s birthday from the DB.`
                    );
                }
            }
        );
    }
}

const cmdHandler = (msgInfo) => {
    if (msgInfo.msgArr.length >= 3 || msgInfo.msgArr[1] === "getall") {
        let fields = null;
        let birthday = null;
        switch (msgInfo.msgArr[1]) {
            case "add":
                fields = msgInfo.content.match(
                    /^\s*\!birthday\s+(add)\s+<@!?(\d+)>\s+([^\s]+)\s*$/
                );
                birthday = new Birthday(
                    fields[1],
                    `<@${fields[2]}>`,
                    fields[3]
                );
                break;
            case "get":
                fields = msgInfo.content.match(
                    /^\s*\!birthday\s+(get)\s+<@!?(\d+)>\s*$/
                );
                birthday = new Birthday(fields[1], `<@${fields[2]}>`);
                break;
            case "getall":
                birthday = new Birthday("getAll");
                break;
            case "delete":
                fields = msgInfo.content.match(
                    /^\s*\!birthday\s+(delete)\s+<@!?(\d+)>\s*$/
                );
                birthday = new Birthday(fields[1], `<@${fields[2]}>`);
                break;
            default:
                msgInfo.channel.send(
                    "Invalid birthday command. Use !help to view proper usage."
                );
                break;
        }

        if (fields !== null || msgInfo.msgArr[1] === "getall") {
            birthday["birthday" + utils.titleCase(msgInfo.msgArr[1])](
                msgInfo.channel
            );
        } else {
            utils.invalidUsage("!birthday", msgInfo.channel);
        }
    } else {
        utils.invalidUsage("!birthday", msgInfo.channel);
    }
};

module.exports = { cmdHandler };
