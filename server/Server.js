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
fs = require('fs');

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

//Other Imports
const useraccounts = require("./routes/users.json");
const { marked } = require("marked"); //Markdown Parsing

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
////////////////////////////////////       ////////////////////////////////////

app.get("/api", function (req, res) {
	// Render README.md at base as it contains lots of useful info, helpful!
	var readme = "../README.md";
	var output = fs.readFileSync(readme, "utf8");
	res.send(marked(output.toString()));
});

app.get("/api/users", function (req, res) {
	//View Users.json
	res.send(useraccounts);
});

app.post("/api/login", (req, res) => {
	const collection = db.collection('credentials');

    //Check if a user with that password exists
    collection.find({'name':username, 'password':password}).count(function (err, count) {
      assert.equal(null, err);

      if (count > 0) { //Someone exists
        res.send({'username':username, 'success':true});
      }else{
        res.send({'username':'', 'success':false});
      }
    });
	// Check user credentials and return validity.
	fullMatch = false;

	//Error Checking
	if (!req.body) {
		return res.sendStatus(400);
		console.log("Recieved Invalid Request: Error 400");
	}

	userEmail = req.body.email;
	userPassword = req.body.password;
	console.log("Recieved Login request for: " + userEmail);
	console.log("Password: " + userPassword);

	var userCredentials = useraccounts.Users.find((el) => el.email == userEmail); // Return first object with email that matches our req.body email

	userData = {
		fullMatch: true,
		username: userCredentials["username"],
		email: userCredentials["email"],
		role: userCredentials["role"],
		password: userCredentials["password"],
		age: userCredentials["age"],
	};

	if (userCredentials != null) {
		console.log("FOUND EMAIL");
		if (userPassword == userCredentials.password) {
			console.log("PASSWORD MATCH");
			fullMatch = true;
			res.send(userData);
		} else {
			console.log("PASSWORD DOES NOT MATCH");
			res.send(fullMatch);
		}
	}
});

app.post("/api/profile", (req, res) => {
	// Check user credentials and return validity.
	//Error Checking
	if (!req.body) {
		return res.sendStatus(400);
		console.log("Recieved Invalid Request: Error 400");
	}

	userEmail = req.body.email;
	console.log("PROFILE DETAILS REQUESTED FOR: " + userEmail);
	var userCredentials = useraccounts.Users.find((el) => el.email == userEmail); // Return first object with email that matches our req.body email
	console.log(userCredentials);

	//Send back response to the login function
	res.send(userCredentials);
});

app.post("/api/register", (req, res) => {
	// Register User to json file/localstorage
	var emailExists = false;

	//Error Checking
	if (!req.body) {
		return res.sendStatus(400);
		console.log("Recieved Invalid Request: Error 400");
	}

	var r_age = req.body.age;
	var r_email = req.body.email;
	var r_username = req.body.username;
	var r_role = req.body.role;
	var r_password = req.body.password;

	var userCredentials = useraccounts.Users.find((el) => el.email == r_email); // Return first object with email that matches our req.body email

	var newData = {
		fullMatch: false,
		username: r_username,
		email: r_email,
		role: r_role,
		password: r_password,
		age: r_age,
	};

	var pushData = {
		username: r_username,
		email: r_email,
		role: r_role,
		password: r_password,
		age: r_age,
	};

	if (userCredentials != null) {
		console.log("FOUND EMAIL MATCH, ALERTING USER");
		newData.fullMatch = true;
		res.send(newData);
	} else {
		console.log("Registered " + r_email + " successfully!");
		useraccounts.Users.push(newData);
		res.send(newData);

		//Save to local JSON
		fs.readFile("./routes/users.json", "utf8", function (error, data) {
			const obj = JSON.parse(data);
			obj.Users.push(pushData);
			let objJson = JSON.stringify(obj);
			fs.writeFile("./routes/users.json", objJson, "utf-8", function (err) {
				if (err) throw err;
			});
		});
	}
});

app.post("/api/login-after", (req, res) => {
	/* Check user credentials and return validity. */
	var age = req.body.age;
	var email = req.body.email;
	var username = req.body.username;
	var role = req.body.role;
	var password = req.body.password;

	var changeData = {
		username: username,
		email: email,
		role: role,
		password: password,
		age: age,
	};
	console.log(changeData);

	fs.readFile("./routes/users.json", "utf8", function (error, data) {
		const tempObj = JSON.parse(data);
		found = false;

		for (let i = 0; i < tempObj.Users.length; i++) {
			if (email == tempObj.Users[i]["email"]) {
				tempObj.Users[i] = changeData;
				found = true;
				res.send({ valid: true });
			}
		}

		if (found == false) {
			res.send({ valid: false });
			tempObj.Users.push(changeData);
		}

		let retJson = JSON.stringify(tempObj);
		fs.writeFile("./routes/users.json", retJson, "utf-8", function (err) {
			if (err) throw err;
		});
	});
});

app.post("/api/add-user", (req, res) => {
	/* Check user credentials and return validity. */
	//Error Checking
	if (!req.body) {
		return res.sendStatus(400);
		console.log("Recieved Invalid Request: Error 400");
	}

	var age = req.body.age;
	var email = req.body.email;
	var username = req.body.username;
	var role = req.body.role;
	var password = req.body.password;

	var addData = {
		username: username,
		email: email,
		role: role,
		password: password,
		age: age,
	};

	//console.log(age,birthdate,email,username,role);
	fs.readFile("./routes/users.json", "utf8", function (error, data) {
		const tempObj = JSON.parse(data);
		exists = false;
		for (let i = 0; i < tempObj.Users.length; i++) {
			if (username == tempObj.Users[i]["username"]) {
				exists = true;
			}
		}
		if (exists == false) {
			tempObj.Users.push(addData);
			res.send({ valid: true });
		} else if (exists == true) {
			res.send({ valid: false });
		}

		let retJson = JSON.stringify(tempObj);
		fs.writeFile("./routes/users.json", retJson, "utf-8", function (err) {
			if (err) throw err;
		});
	});
});

app.post("/api/get-users", (req, res) => {
	/* Check user credentials and return validity. */
	//Error Checking
	if (!req.body) {
		return res.sendStatus(400);
		console.log("Recieved Invalid Request: Error 400");
	}

	fs.readFile("./routes/users.json", "utf8", function (error, data) {
		if (error) return console.log(error);
		const userValues = JSON.parse(data);
		res.send({ userValues });
	});
});

app.post("/api/delete-user", (req, res) => {
	/* Check user credentials and return validity. */
	//Error Checking
	if (!req.body) {
		return res.sendStatus(400);
		console.log("Recieved Invalid Request: Error 400");
	}

	var d_username = req.body.username;

	fs.readFile("./routes/users.json", "utf8", function (error, data) {
		const tempObj = JSON.parse(data);

		for (let i = 0; i < tempObj.Users.length; i++) {
			if (d_username == tempObj.Users[i]["username"]) {
				tempObj.Users.splice(i, 1);
				res.send({ valid: true });
				console.log(tempObj);
			}
		}

		let retJson = JSON.stringify(tempObj);
		fs.writeFile("./routes/users.json", retJson, "utf-8", function (err) {
			if (err) throw err;
		});
	});
});

app.post("/api/list-channel", (req, res) => {
	/* Check user credentials and return validity. */
	//Error Checking
	if (!req.body) {
		return res.sendStatus(400);
		console.log("Recieved Invalid Request: Error 400");
	}

	fs.readFile("./routes/channels.json", "utf8", function (error, data) {
		if (error) return console.log(error);
		const channelValues = JSON.parse(data);
		res.send({ channelValues });
	});
});

app.post("/api/add-channel", (req, res) => {
	/* Check user credentials and return validity. */
	//Error Checking
	if (!req.body) {
		return res.sendStatus(400);
		console.log("Recieved Invalid Request: Error 400");
	}

	var channelname = req.body.channelname;
	var channelID = req.body.channelID;

	var addData = {
		channelname: channelname,
		channelID: channelID,
	};

	//console.log(age,birthdate,email,username,role);
	fs.readFile("./routes/channels.json", "utf8", function (error, data) {
		const tempObj = JSON.parse(data);
		exists = false;
		for (let i = 0; i < tempObj.Channels.length; i++) {
			if (channelname == tempObj.Channels[i]["channelname"]) {
				exists = true;
			}
		}
		if (exists == false) {
			tempObj.Channels.push(addData);
			res.send({ valid: true });
		} else if (exists == true) {
			res.send({ valid: false });
		}

		let retJson = JSON.stringify(tempObj);
		fs.writeFile("./routes/channels.json", retJson, "utf-8", function (err) {
			if (err) throw err;
		});
	});
});

app.post("/api/delete-channel", (req, res) => {
	/* Check user credentials and return validity. */
	//Error Checking
	if (!req.body) {
		return res.sendStatus(400);
		console.log("Recieved Invalid Request: Error 400");
	}

	var d_channel = req.body.channelname;

	fs.readFile("./routes/channels.json", "utf8", function (error, data) {
		const tempObj = JSON.parse(data);

		for (let i = 0; i < tempObj.Channels.length; i++) {
			if (d_channel == tempObj.Channels[i]["channelname"]) {
				tempObj.Channels.splice(i, 1);
				res.send({ valid: true });
				console.log(tempObj);
			}
		}

		let retJson = JSON.stringify(tempObj);
		fs.writeFile("./routes/channels.json", retJson, "utf-8", function (err) {
			if (err) throw err;
		});
	});
});

app.post("/api/list-group", (req, res) => {
	/* Check user credentials and return validity. */
	//Error Checking
	if (!req.body) {
		return res.sendStatus(400);
		console.log("Recieved Invalid Request: Error 400");
	}

	fs.readFile("./routes/groups.json", "utf8", function (error, data) {
		if (error) return console.log(error);
		const groupValues = JSON.parse(data);
		res.send({ groupValues });
	});
});

app.post("/api/add-group", (req, res) => {
	/* Check user credentials and return validity. */
	//Error Checking
	if (!req.body) {
		return res.sendStatus(400);
		console.log("Recieved Invalid Request: Error 400");
	}

	var groupname = req.body.groupname;
	var groupID = req.body.groupID;

	var addData = {
		groupname: groupname,
		groupID: groupID,
	};

	fs.readFile("./routes/groups.json", "utf8", function (error, data) {
		const tempObj = JSON.parse(data);
		exists = false;
		for (let i = 0; i < tempObj.Groups.length; i++) {
			if (groupname == tempObj.Groups[i]["groupname"]) {
				exists = true;
			}
		}
		if (exists == false) {
			tempObj.Groups.push(addData);
			res.send({ valid: true });
		} else if (exists == true) {
			res.send({ valid: false });
		}

		let retJson = JSON.stringify(tempObj);
		fs.writeFile("./routes/groups.json", retJson, "utf-8", function (err) {
			if (err) throw err;
		});
	});
});

app.post("/api/delete-group", (req, res) => {
	/* Check user credentials and return validity. */
	//Error Checking
	if (!req.body) {
		return res.sendStatus(400);
		console.log("Recieved Invalid Request: Error 400");
	}

	var d_group = req.body.groupname;

	fs.readFile("./routes/groups.json", "utf8", function (error, data) {
		const tempObj = JSON.parse(data);

		for (let i = 0; i < tempObj.Groups.length; i++) {
			if (d_group == tempObj.Groups[i]["channelname"]) {
				tempObj.Groups.splice(i, 1);
				res.send({ valid: true });
				console.log(tempObj);
			}
		}

		let retJson = JSON.stringify(tempObj);
		fs.writeFile("./routes/groups.json", retJson, "utf-8", function (err) {
			if (err) throw err;
		});
	});
});

//Export REST API
module.exports = app;
