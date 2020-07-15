require("dotenv").config()
const express = require("express");
const http = require("http");

const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);

app.use(process.env.BASE, express.static("public"));

app.get(process.env.BASE, (request, response) => {
    response.sendFile(__dirname + "/views/index.html");
});

app.get(process.env.BASE + 'about', (request, response) => {
    response.sendFile(__dirname + "/views/about.html");
});

app.get(process.env.BASE + 'utopia', (request, response) => {
    response.sendFile(__dirname + "/views/projects/utopia.html");
});

app.get(process.env.BASE + 'speech-bubbles', (request, response) => {
    response.sendFile(__dirname + "/views/projects/speech-bubbles.html");
});

app.get(process.env.BASE + 'mars', (request, response) => {
    response.sendFile(__dirname + "/views/projects/mars.html");
});

app.get(process.env.BASE + 'advertising-bot', (request, response) => {
    response.sendFile(__dirname + "/views/projects/advertising-bot.html");
});

app.get(process.env.BASE + 'sonance', (request, response) => {
    response.sendFile(__dirname + "/views/projects/sonance.html");
});

app.get(process.env.BASE + 'bbc-habitat', (request, response) => {
    response.sendFile(__dirname + "/views/projects/bbc-habitat.html");
});

// listen for requests :)
const listener = server.listen(port, () => {
    console.log(`Server is listening on port ${listener.address().port}`);
});