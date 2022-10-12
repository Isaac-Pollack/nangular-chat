const express = require('express')
const app = express();
const cors = require('cors');
const path = require('path');
const http = require('http').Server(app);
const io = require("socket.io")(http, {
	cors: {
		origin: "http://localhost:4200",
		methods: ["GET", "POST"],
	},
});
const sockets = require("./Socket.js");
const server = require('./listen.js');
const { marked } = require("marked"); //Markdown Parsing
fs = require('fs');

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

//CORS
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

const PORT = 3000;
app.use(cors());

// Point static path to dist if you want to use your own server to serve Angular webpages
app.use(express.static(path.join(__dirname + "/public"))); //Serve static content from the 'public'
console.log("Static directory is: " + __dirname);

app.use(cors());
sockets.connect(io, PORT);
server.listen(http, PORT);

//Setup MongoDB Connection
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://127.0.0.1:27017';
MongoClient.connect(url, {maxPoolSize:10, useNewUrlParser: true, useUnifiedTopology: true}, function(err, client) {
  //When we have a connection, start the app.
  if (err) {return console.log(err)}
  const dbName = '3813DB'
  const db = client.db(dbName);

	//Users
	require('./routes/Users/login')(app, db); // Auth
	require('./routes/Users/getUsers')(app, db); // All users
	require('./routes/Users/deleteUser')(app, db); // Delete
	require('./routes/Users/insertUser')(app, db); // Insert

	//Groups
	require('./routes/Groups/insertGroup')(app, db); //create a group
	require('./routes/Groups/getGroups')(app, db); // All groups
	require('./routes/Groups/deleteGroup')(app, db); // Delete
	require('./routes/Groups/updateGroup')(app, db); // Update

	//Channels
	require('./routes/Channels/insertChannel')(app, db); // New channel
	require('./routes/Channels/getChannels')(app, db); // All channels
	require('./routes/Channels/deleteChannel')(app, db); // Delete

	//Chat
	require('./routes/Chat/getChatHistory')(app, db); // Return chat history
	require('./routes/Chat/insertChatHistory')(app, db); // Insert
	require('./routes/Chat/deleteChatHistory')(app, db); // Delete
});

//////////////////////////////////// Routes ////////////////////////////////////

app.get("/api", function (req, res) {
	// Render README.md at base as it contains lots of useful info, helpful!
	var readme = "../README.md";
	var output = fs.readFileSync(readme, "utf8");
	res.send(marked(output.toString()));
});

//Export REST API
module.exports = app;
