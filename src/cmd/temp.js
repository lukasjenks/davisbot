const Discord = require('discord.js');
const utils = require('../lib/utils');
const axios = require("axios").default;
const authInfo = require("../../auth.json");

const outputTemp = (dayNum, channel) => {
	
    let options = {
        method: 'GET',
		params: {lat: "53.5461",
				 lon: "-113.4938",
				 exclude: "minutely,hourly,alerts",
				 units: "metric",
				 appid: authInfo.openWeatherMapToken}
    };

	// e.g. https://api.openweathermap.org/data/2.5/onecall?lat=53.5461&lon=-113.4938&exclude=minutely,hourly,alerts&units=metric&appid=[apiKey]
    axios.get("https://api.openweathermap.org/data/3.0/onecall", options).then(response => {
		// response.data.current, response.data.daily.dt = unix epoch time
		//86400 epoch unix time seconds in a day
		// Current data is structured differently in response JSON so must be parsed differently
		let entry = dayNum === 0 ? response.data.current : response.data.daily[dayNum];
		if (dayNum === 0) {
			const embed = new Discord.MessageEmbed()
				.setTitle("Current Conditions (" + new Date().toDateString() + ")")
				.setAuthor("OpenWeatherMap", "https://upload.wikimedia.org/wikipedia/commons/f/f6/OpenWeather-Logo.jpg")
				.setColor('#00c0f5')
				.addField("Temperature", entry.temp.toFixed(1) + "°C")
				.addField("Feels Like", entry.feels_like.toFixed(1) + "°C")
				.addField("Chance of Precipitation", response.data.daily[0].pop*100 + "%")
				.addField("Wind Speed", entry.wind_speed + "m/s")
				.addField("Description", entry.weather[0].main + " (" + entry.weather[0].description + ")")
			channel.send({ embeds: [embed] });
		} else {
			const embed = new Discord.MessageEmbed()
				.setTitle("Forecast for: " + new Date(entry.dt * 1000).toDateString())
				.setAuthor("OpenWeatherMap", "https://upload.wikimedia.org/wikipedia/commons/f/f6/OpenWeather-Logo.jpg")
				.setColor('#00c0f5')
				.addField("High", entry.temp.max.toFixed(1) + "°C")
				.addField("Low", entry.temp.min.toFixed(1) + "°C")
				.addField("Chance of Precipitation", entry.pop*100 + "%")
				.addField("Wind Speed", entry.wind_speed + "m/s")
				.addField("Description", entry.weather[0].main + " (" + entry.weather[0].description + ")")
			channel.send({ embeds: [embed] });
		}
	}).catch(error => {
		console.log(error);
		channel.send("An error occured. Error: " + error);
	});
}

const getDateFromCmdFields = (fields) => {
	if (fields[1] === undefined || fields[1] === "now") {
		return 0;
	} else if (fields[1] === "tomorrow") {
		return 1;
	} else {
		const days = {"monday": 1, "tuesday": 2, "wednesday": 3, "thursday": 4, "friday": 5, "saturday": 6, "sunday": 7};
		const day = new Date().getDay();
		const targetDay = days[fields[1]];
		let dayOffset = targetDay - day;
		dayOffset < 0 ? dayOffset += 7 : null;
		return dayOffset
	}
}

// Wrap cmdHandler function in this way such that it can be called by building a dynamically generated
// string of the function name in bot.js
const cmdHandler = (msgInfo) => {
    // Extract with regex
    // !define [term]
    const fields = msgInfo.content.match(msgInfo.regex.tempCmd);
    
    if (fields === null) {
        utils.invalidUsage("!temp", msgInfo.channel);
        return;
    }

	let dayNum = getDateFromCmdFields(fields);
	outputTemp(dayNum, msgInfo.channel);
}

module.exports = { cmdHandler };
