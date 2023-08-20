const express = require('express');
const path = require('path');
const axios = require('axios');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
require('dotenv').config();
app.use(express.static('public'))
app.set("view engine","ejs")

app.get('/', (req, res) => {
    const sendData = {
        location: "Location",
        country: "Country",
        temp: "Temp",
        desc: "Description",
        feel: "Feel-like",
        humidity: "humidity",
        speed: "speed"
    };
    res.render('index', { sendData: sendData });
});

app.post('/', async (req, res) => {
    let location = req.body.city;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.APIKEY}&units=metric`;
    
    try {
        const response = await axios.get(url);
        const responseData = response.data;
        const temp = Math.floor(responseData.main.temp);
        const desc = responseData.weather[0].description;

        const sendData = {
            temp: temp,
            desc: desc,
            location: location,
            feel: responseData.main.feels_like,
            humidity: responseData.main.humidity,
            speed: responseData.wind.speed,
            country: responseData.sys.country
        };

        res.render('index', { sendData: sendData });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send('An error occurred.');
    }
});


app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
