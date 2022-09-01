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
const fs = require('fs'); //Filesystem interaction
const useraccounts = require('./users.json');

// Markdown Parsing
const { marked } = require('marked'); //Marked.js

//Define port used for the server
const PORT = 3000;

//Apply the middleware
app.use(cors()); //Cross origin requests -  from localhost:3000 > localhost:4200
app.use(express.urlencoded({extended:true})); //
app.use(express.json());

//Setup Socket
sockets.connect(io, PORT);

//Start server listening for requests.
server.listen(http, PORT);

// Point static path to dist if you want to use your own server to serve Angular webpages
app.use(express.static(path.join(__dirname + '/../dist/nangular-chat'))); //Serve static content from the 'public'
console.log('Static directory is: ' + __dirname);

// JSON Serialisation
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//REST API Endpoints
app.get('/api', function(req, res) { // Render README.md at base as it contains lots of useful info, helpful!
  var readme = '../README.md';
  var output = fs.readFileSync(readme, 'utf8');
  res.send(marked(output.toString()));
});

app.get('/api/users', function(req, res) { //View Users.json
  res.send(useraccounts)
});

app.post('/api/login', function(req, res) { // Check user credentials and return validity.
  if (!req.body) {
    return res.sendStatus(400)
  }

  var user = {}
  user.email = req.body.email;
  user.pwd = req.body.pwd;

  if (!req.body.email == "super@test.com" && req.body.pwd == "test") {
    user.valid = true;
  } else {
    user.valid = false;
  }
  res.send(user);
});

//Export REST API
module.exports = app;