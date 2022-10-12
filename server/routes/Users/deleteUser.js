module.exports = function (app, db) {

    /* Deleting a user from the database. */
    app.post("/api/deleteUser", (req, res) => {
        var query = { username: req.body.username };
        console.log("deleting user: ", req.body.username);
        db.collection("users").deleteOne(query, function(err) {
            if (err) throw err;
            res.send(true);
        });
    });

  }