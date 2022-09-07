const express = require("express"); //Import express.js
const app = express(); //Create the express application
const http = require("http").Server(app);
const path = require("path"); //Helps generating links to correct directory
const cors = require("cors");
const bodyParser = require("body-parser"); // Create an instance of body-parser
const server = require("./Listen.js");
const fs = require("fs"); //Filesystem interaction

//Other Imports
const useraccounts = require("./routes/users.json");
const { marked } = require("marked"); //Markdown Parsing

//Sockets.io - UNUSED AT THIS POINT
const io = require("socket.io")(http, {
	cors: {
		origin: "http://localhost:4200",
		methods: ["GET", "POST"],
	},
});
const sockets = require("./Socket.js");

//Define port used for the server
const PORT = 3000;

//Apply the middleware
app.use(cors()); //Cross origin requests -  from localhost:3000 > localhost:4200
app.use(express.urlencoded({ extended: true })); //
app.use(express.json());

// Point static path to dist if you want to use your own server to serve Angular webpages
app.use(express.static(path.join(__dirname + "/public"))); //Serve static content from the 'public'
console.log("Static directory is: " + __dirname);

//Setup Socket
sockets.connect(io, PORT);

//Start server listening for requests.
server.listen(http, PORT);

//REST API Endpoints
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

	registerEmail = req.body.email;
	registerPassword = req.body.password;
	console.log("Recieved Register request for: " + registerEmail);
	console.log("Password: " + registerPassword);

	var userCredentials = useraccounts.Users.find(
		(el) => el.email == registerEmail
	); // Return first object with email that matches our req.body email

	var lastUserID = useraccounts.Users[useraccounts.Users.length - 1].userid; // Grab the last value for userid in our JSON file, so we can increment on it

	let newUserCredentials = {
		userid: lastUserID + 1,
		username: registerEmail,
		role: "Default",
		email: registerEmail,
		password: registerPassword,
	};

	if (userCredentials != null) {
		console.log("FOUND EMAIL MATCH, ALERTING USER");
		emailExists = true;
	} else {
		console.log("Registered " + registerEmail + " successfully!");
	}

	let toWriteData = JSON.stringify(newUserCredentials, null, 2);
	fs.write("./routes/users.json", toWriteData, (err) => {
		if (err) throw err;
		console.log("Data written to file");
	});

	//Send back response to the login function
	res.send(emailExists);
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
		const obj = JSON.parse(data);
		found = false;

		if (email == obj.Users.find((el) => el.email == email)) {
			obj.Users = changeData;
			found = true;
			res.send({ ok: true });
		}

		if (found == false) {
			res.send({ ok: false });
			obj.Users.push(changeData);
		}
		let objJson = JSON.stringify(obj);
		fs.writeFile("./routes/users.json", objJson, "utf-8", function (err) {
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
});

app.post("/api/manage-user", (req, res) => {
	/* Check user credentials and return validity. */
	//Error Checking
	if (!req.body) {
		return res.sendStatus(400);
		console.log("Recieved Invalid Request: Error 400");
	}
});

app.post("/api/delete-user", (req, res) => {
	/* Check user credentials and return validity. */
	//Error Checking
	if (!req.body) {
		return res.sendStatus(400);
		console.log("Recieved Invalid Request: Error 400");
	}
});

app.post("/api/list-group-members", (req, res) => {
	/* Check user credentials and return validity. */
	//Error Checking
	if (!req.body) {
		return res.sendStatus(400);
		console.log("Recieved Invalid Request: Error 400");
	}
});

app.post("/api/delete-group-members", (req, res) => {
	/* Check user credentials and return validity. */
	//Error Checking
	if (!req.body) {
		return res.sendStatus(400);
		console.log("Recieved Invalid Request: Error 400");
	}
});

app.post("/api/add-group-member", (req, res) => {
	/* Check user credentials and return validity. */
	//Error Checking
	if (!req.body) {
		return res.sendStatus(400);
		console.log("Recieved Invalid Request: Error 400");
	}

	var username = req.body.username;
	var groupname = req.body.groupname;

	//console.log(username);
	//console.log(groupname);
	var group_num = 0;

	//console.log(age,birthdate,email,username,role);
	fs.readFile("./Data/group.json", "utf8", function (error, data) {
		const obj = JSON.parse(data);
		found = false;
		for (let i = 0; i < obj.group.length; i++) {
			for (let j = 0; j < obj.group[i]["user_list"].length; j++) {
				if (username == obj.group[i]["user_list"][j]) {
					found = true;
					//console.log("roop1: "+obj.group[i]['user_list'][j]);
					break;
				}
			}
		}
		for (let i = 0; i < obj.group.length; i++) {
			if (groupname == obj.group[i]["groupname"]) {
				group_num = i;
				break;
			}
		}
		//console.log(group_num);
		if (found == false) {
			obj.group[group_num]["user_list"].push(username);
			res.send({ ok: true });
		} else if (found == true) {
			res.send({ ok: false });
		}
		let objJson = JSON.stringify(obj);
		fs.writeFile("./Data/group.json", objJson, "utf-8", function (err) {
			if (err) throw err;
		});
	});
});

app.post("/api/list-group-admins", (req, res) => {
	/* Check user credentials and return validity. */
	//Error Checking
	if (!req.body) {
		return res.sendStatus(400);
		console.log("Recieved Invalid Request: Error 400");
	}
});

app.post("/api/list-channel", (req, res) => {
	/* Check user credentials and return validity. */
	//Error Checking
	if (!req.body) {
		return res.sendStatus(400);
		console.log("Recieved Invalid Request: Error 400");
	}
});

app.post("/api/add-channel", (req, res) => {
	/* Check user credentials and return validity. */
	//Error Checking
	if (!req.body) {
		return res.sendStatus(400);
		console.log("Recieved Invalid Request: Error 400");
	}
});

app.post("/api/delete-channel", (req, res) => {
	/* Check user credentials and return validity. */
	//Error Checking
	if (!req.body) {
		return res.sendStatus(400);
		console.log("Recieved Invalid Request: Error 400");
	}
});

app.post("/api/add-user-to-channel", (req, res) => {
	/* Check user credentials and return validity. */
	//Error Checking
	if (!req.body) {
		return res.sendStatus(400);
		console.log("Recieved Invalid Request: Error 400");
	}
});

//Export REST API
module.exports = app;
