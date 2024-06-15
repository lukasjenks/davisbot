const Discord = require("discord.js");
const db = require("../lib/db");
const utils = require("../lib/utils");

class Birthday {
    constructor(subCmd, userTag = null, firstName = null, birthday = null) {
        this.subCmd = subCmd;
        this.userTag = userTag;
        this.firstName = firstName;
        this.birthday = birthday;
    }

    dateStringToDisplayText(dateStr) {
        let parts = dateStr.split("-");

        // Please note that months are 0-based in JavaScript
        let date = new Date(parts[0], parts[1] - 1, parts[2]);

        let monthNames = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ];

        let day = date.getDate();
        let suffix =
            day === 1 ? "st" : day === 2 ? "nd" : day === 3 ? "rd" : "th";

        let humanReadableDate = `${
            monthNames[date.getMonth()]
        } ${day}${suffix}`;

        return humanReadableDate;
    }

    birthdayAdd(channel) {
        db.run(
            "insert into birthday (user_tag, first_name, birthday) values (?, ?, ?)",
            [this.userTag, this.firstName, this.birthday],
            (err) => {
                if (err) {
                    channel.send(
                        "An error occured. Usage: !birthday add [@user] [first name] [birthday, e.g. 1996-06-30]. Error: " +
                            err.Error
                    );
                    console.log(err);
                } else {
                    const possessiveArticle = this.firstName.endsWith("s")
                        ? `'`
                        : `'s`;
                    channel.send(
                        `Successfully added birthday to DB. #general will be notified about ${
                            this.firstName
                        }${possessiveArticle} birthday on ${this.dateStringToDisplayText(
                            this.birthday
                        )}`
                    );
                }
            }
        );
    }

    birthdayList(channel) {
        db.all(
            `select user_tag, first_name, birthday from birthday order by first_name`,
            [],
            (err, birthdayRecs) => {
                if (err) {
                    channel.send("An error occured. Error: " + err.Error);
                } else {
                    let message = "Available Birthdays in DB:\n";
                    birthdayRecs.forEach((birthdayRec) => {
                        message =
                            message +
                            `${birthdayRec.user_tag} ${
                                birthdayRec.first_name
                            } ${this.dateStringToDisplayText(
                                birthdayRec.birthday
                            )}\n`;
                    });
                    channel.send(message);
                }
            }
        );
    }
}

// Wrap cmdHandler function in this way such that it can be called by building a dynamically generated
// string of the function name in bot.js
const cmdHandler = (msgInfo) => {
    // Extract with regex
    // !birthday list
    // !birthday add [user_tag] [first_name] [birthday]
    let fields = null;
    switch (msgInfo.msgArr[1]) {
        case "add":
            fields = msgInfo.content.match(msgInfo.regex.birthdayAddCmd);
            break;
        case "list":
            fields = msgInfo.content.match(msgInfo.regex.birthdayListCmd);
            break;
        default:
            break;
    }

    if (fields === null) {
        utils.invalidUsage("!birthday", msgInfo.channel);
        return;
    }

    // Captured fields in the result of match start at index 1
    fields = fields.slice(1);
    let birthday = new Birthday(...fields);

    // Call appropriate class function dynamically - e.g. picAdd
    birthday["birthday" + utils.titleCase(fields[0])](msgInfo.channel);
};

module.exports = { cmdHandler };
