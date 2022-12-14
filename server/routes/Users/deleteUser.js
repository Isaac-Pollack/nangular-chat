module.exports = function (app, db) {
	// Delete user from DB
	app.post("/api/deleteUser", (req, res) => {
		console.log("deleting user: ", req.body.username);
		var query = { username: req.body.username };
		db.collection("users").deleteOne(query, function (err) {
			if (err) throw err;
			res.send(true);
		});
	});
};
