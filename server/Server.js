const express = require('express'); //Import express.js
const app = express(); //Create the express application

// Cross origin resource sharing to cater for port 4200 to port 3000
const cors = require('cors');
const http = require("http").Server(app);
const path = require('path'); //Helps generating links to correct directory
const bodyParser = require('body-parser'); // Create an instance of nody-parser
const io = require('socket.io')(http, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"],
  }
});
const sockets = require('./Socket.js');
const server = require('./Listen.js');
//const request = require('request');

//Define port used for the server
const PORT = 3000;

//Apply the middleware
app.use(cors()); //Help with connections from localhost:3000 > localhost:4200
app.use (bodyParser.json()); //Parse JSON data

//Setup Socket
sockets.connect(io, PORT);

//Start server listening for requests.
server.listen(http, PORT);

// Point static path to dist if you want to use your own server to serve Angular webpages
app.use(express.static(path.join(__dirname + '/../dist/nangular-chat'))); //Serve static content from the 'public'
console.log(__dirname);

// JSON Serialisation
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//API Endpoints
//app.get('/api/auth', signIn);

//Export REST API
module.exports = app;