module.exports = function(app, db){

  //Checks credentials and returns validity
    app.post("/api/auth", async (req, res) => {

        var usernameSubmission = req.body.username;
        var passwordSubmission = req.body.password;

        console.log("Successfully authenticated:", usernameSubmission);

        userObject = {username: usernameSubmission, password: passwordSubmission};

        const collection = db.collection("users");

        //1 if valid, 0 if invalid, simple !TODO increase error checking
        collection.countDocuments((userObject), function (err, count) {
            if (count > 0) {
                res.send({'username': usernameSubmission, 'valid': true});
            }
            else {
                res.send({'valid': false});
            }
        });
    });

}
