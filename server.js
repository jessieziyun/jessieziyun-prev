require("dotenv").config()
const express = require("express");
const http = require("http");

const app = express();
const port = process.env.PORT || 3000;
const base = process.env.BASE || "/";
const server = http.createServer(app);

app.use(base, express.static("public"));

app.get(base, (request, response) => {
    response.sendFile(__dirname + "/views/index.html");
});

app.get(base + 'about', (request, response) => {
    response.sendFile(__dirname + "/views/about.html");
});

app.get(base + 'utopia', (request, response) => {
    response.sendFile(__dirname + "/views/projects/utopia.html");
});

app.get(base + 'speech-bubbles', (request, response) => {
    response.sendFile(__dirname + "/views/projects/speech-bubbles.html");
});

app.get(base + 'mars', (request, response) => {
    response.sendFile(__dirname + "/views/projects/mars.html");
});

app.get(base + 'advertising-bot', (request, response) => {
    response.sendFile(__dirname + "/views/projects/advertising-bot.html");
});

app.get(base + 'sonance', (request, response) => {
    response.sendFile(__dirname + "/views/projects/sonance.html");
});

app.get(base + 'bbc-habitat', (request, response) => {
    response.sendFile(__dirname + "/views/projects/bbc-habitat.html");
});

// listen for requests :)
const listener = server.listen(port, () => {
    console.log(`Server is listening on port ${listener.address().port}`);
});