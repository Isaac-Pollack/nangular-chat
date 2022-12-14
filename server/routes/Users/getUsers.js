module.exports = function (app, db) {
	// Returns user collection
	app.get("/api/getUsers", (req, res) => {
		var query = {};
		db.collection("users")
			.find(query)
			.toArray(function (err, result) {
				if (err) throw err;
				res.send(result);
			});
	});
};
