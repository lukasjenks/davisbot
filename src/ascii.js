const figlet = require('figlet');


exports.draw = (msg, msgArr) => {
    if (msgArr.length > 1) {
        msgArr.splice(0, 1);
        let messageString = msgArr.join(" ");

        if (/^[0-9a-zA-Z=!?]{1,}$/.test(messageString)) {
            figlet(messageString, (err, data) => {
                if (err) {
                    console.log('Something went wrong...');
                    console.dir(err);
                    return;
                }
                let total = "```"; // this allows it to format nicelyish in discord
                total += data;
                total += "```";
                msg.channel.send(total);
            });
        }
    } else {
        msg.channel.send("Must include a valid argument!");
    }
}