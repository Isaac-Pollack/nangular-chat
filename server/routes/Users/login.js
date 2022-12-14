module.exports = function (app, db) {
	//Checks credentials and returns validity
	app.post("/api/auth", async (req, res) => {
		const collection = db.collection("users");

		console.log("Attempting to authenticate:", req.body.username);
		collection.findOne(
			{ username: req.body.username },
			{ projection: { _id: 0 } },
			function (err, result) {
				if (err) throw err;
				//DEBUG: console.log(result);

				if (result != null) {
					if (
						result.username === req.body.username &&
						result.password === req.body.password
					) {
						//Successfull
						res.send({ username: req.body.username, valid: true });
						console.log("Successfully authenticated:", req.body.username);
					} else {
						//Unsuccessfull
						res.send({ valid: false });
						console.log(
							"Unsuccessfull authentication:",
							req.body.username + "\n",
						);
					}
				} else {
					res.send({ valid: false });
					console.log(
						"Unsuccessfull authentication:",
						req.body.username + "\n",
					);
				}
			},
		);
	});
};
