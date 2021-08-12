const Discord = require('discord.js');
const utils = require('../lib/utils');
const axios = require("axios").default;
const authInfo = require("../../auth.json");

const outputTemp = (date, channel) => {
	
    let options = {
        method: 'GET',
		params: {lat: "53.5461",
				 lon: "-113.4938",
				 exclude: "minutely,hourly,alerts",
				 units: "metric",
				 appid: authInfo.openWeatherMapToken}
    };

	// e.g. https://api.openweathermap.org/data/2.5/onecall?lat=53.5461&lon=-113.4938&exclude=minutely,hourly,alerts&units=metric&appid=[apiKey]
    axios.get("https://api.openweathermap.org/data/2.5/onecall", options).then(response => {
		// response.data.current, response.data.daily.dt = unix epoch time
		//86400 epoch unix time seconds in a day
		let now = new Date().valueOf();
		// Current data is structured differently in response JSON so must be parsed differently
		if (response.data.current.sunrise < now < response.data.current.sunset) {
			let entry = response.data.current;
			const embed = new Discord.RichEmbed()
				.setTitle("Forecast for " + new Date().toDateString())
				.setAuthor("OpenWeatherMap", "https://upload.wikimedia.org/wikipedia/commons/f/f6/OpenWeather-Logo.jpg")
				.setColor('#00c0f5')
				.addField("Temperature", entry.temp)
				.addField("Feels Like", entry.feels_like)
				.addField("Humidity", entry.humidity)
				.addField("Wind Speed", entry.wind_speed)
				.addField("Description", entry.weather[0].main + " (" + entry.weather[0].description + ")")
			channel.send(embed);
		} else {
			// Handle tomorrow and all other days here
		}
	}).catch(error => {
		console.log(error);
		channel.send("An error occured. Error: " + error);
	});
}
			/*
			    "timezone": "America/Edmonton",
  "timezone_offset": -21600,
  "current": {
    "dt": 1628785747,
    "sunrise": 1628770134,
    "sunset": 1628824150,
    "temp": 18.51,
    "feels_like": 17.8,
    "pressure": 1021,
    "humidity": 53,
    "dew_point": 8.76,
    "uvi": 2.74,
    "clouds": 20,
    "visibility": 10000,
    "wind_speed": 2.06,
    "wind_deg": 290,
    "weather": [
      {
        "id": 801,
        "main": "Clouds",
        "description": "few clouds",
        "icon": "02d"
      }
    ]
  },
  */

// Returns current time in epoch seconds
const getDateFromCmdFields = (fields) => {
	if (fields[1] === undefined || fields[1] === "now") {
		return new Date().valueOf();
	} else if (fields[1] === "tomorrow") {
		const today = new Date();
		const tomorrow = new Date(today);
		tomorrow.setDate(tomorrow.getDate() + 1);
		return tomorrow.valueOf();
	} else if (fields[1] === "next") {
		const days = {"monday": 1, "tuesday": 2, "wednesday": 3, "thursday": 4, "friday": 5, "saturday": 6, "sunday": 7};
		let d = new Date();
		const day = d.getDay();
		const targetDay = days[fields[2]];
		let dayOffset = targetDay - day;
		dayOffset < 0 ? dayOffset += 7 : null;
		d = new Date(d.getTime() + (dayOffset * 24 * 3600 * 1000));
		return d.valueOf();
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

	let date = getDateFromCmdFields(fields);
	outputTemp(date, msgInfo.channel);
}

module.exports = { cmdHandler };
