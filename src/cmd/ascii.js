const figlet = require('figlet');

const cmdHandler = (msgInfo) => {
    if (msgInfo.msgArr.length > 1) {
        msgInfo.msgArr.splice(0, 1);
        let messageString = msgInfo.msgArr.join(" ");

        if (msgInfo.regex.validFiglet.test(messageString)) {
            figlet(messageString, (err, data) => {
                if (err) {
                    msgInfo.channel.send("An error occured converting your string to ascii.")
                    console.log('Error calling figlet to generate ascii');
                    console.dir(err);
                    return;
                }
                let total = "```"; // this allows it to format nicelyish in discord
                total += data;
                total += "```";
                msgInfo.channel.send(total);
            });
        }
    } else {
        msgInfo.channel.send("Must include a string to convert to ascii.");
    }
}

module.exports = { cmdHandler };