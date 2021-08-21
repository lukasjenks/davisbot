const Discord = require('discord.js');
const utils = require('../lib/utils');
const axios = require("axios").default;
const authInfo = require("../../auth.json");

const outputWeather = (date, client, channel) => {
	
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
		let entry = null;
		// Current data is structured differently in response JSON so must be parsed differently
		if (response.data.current.sunrise < date < response.data.current.sunset) {
			entry = response.data.current;
			let forecast = response.data.daily[0];
			const embed = new Discord.RichEmbed()
				.setTitle("Forecast for " + new Date().toDateString())
				.setAuthor("OpenWeatherMap", "https://upload.wikimedia.org/wikipedia/commons/f/f6/OpenWeather-Logo.jpg")
				.setColor('#00c0f5')
				.addField("Temperature", entry.temp + "°C")
				.addField("Feels Like", entry.feels_like + "°C")
				.addField("Humidity", entry.humidity + "g.kg-1")
				.addField("Wind Speed", entry.wind_speed + "m/s")
				.addField("Description", entry.weather[0].main + " (" + entry.weather[0].description + ")")
				.addField("Morning", forecast.temp.morn + "°C")
				.addField("Day", forecast.temp.day + "°C")
				.addField("Evening", forecast.temp.eve + "°C")
				.addField("Night", forecast.temp.night + "°C")
				.addField("Maximum", forecast.temp.max + "°C")
				.addField("Minimum", forecast.temp.min + "°C")
			channel.send(embed);
		} else {
			msg.channel.send(date.toDateString());
			let entries = response.data.daily.slice(1);
			// Handle tomorrow and all other days here
			for (let i=0; i<entries.length; i++) {
				if (entries[i].sunrise < date < entires[i].sunset) {
					entry = entries[i];
				}
			}

			if (entry != null) {
				const embed = new Discord.RichEmbed()
					.setTitle("Forecast for " + new Date(date))
					.setAuthor("OpenWeatherMap", "https://upload.wikimedia.org/wikipedia/commons/f/f6/OpenWeather-Logo.jpg")
					.setColor('#00c0f5')
					.addField("Morning", entry.temp.morn + "°C")
					.addField("Day", entry.temp.day + "°C")
					.addField("Evening", entry.temp.eve + "°C")
					.addField("Night", entry.temp.night + "°C")
					.addField("Maximum", entry.temp.max + "°C")
					.addField("Minimum", entry.temp.min + "°C")
					.addField("Wind Speed", entry.wind_speed + "m/s")
					.addField("Humidity", entry.humidity + "g.kg-1")
					.addField("Description", entry.weather[0].main + " (" + entry.weather[0].description + ")")
				channel.send(embed);
			} else {
				channel.send("Forecast for the given day is not available.");
			}
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
	console.log(fields);
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
    const fields = msgInfo.content.match(msgInfo.regex.weatherCmd);
    
    if (fields === null) {
        utils.invalidUsage("!weather", msgInfo.channel);
        return;
    }

	let date = getDateFromCmdFields(fields);
	console.log(new Date(date).toDateString());
	outputWeather(date, msgInfo.client, msgInfo.channel);
}

module.exports = { cmdHandler };
