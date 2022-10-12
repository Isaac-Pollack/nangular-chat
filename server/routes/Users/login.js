module.exports = function(app, db){

    /* This is the code that is run when the user submits their username and password. It checks the
    database to see if the username and password combination is valid. If it is, it sends a response
    to the client saying that the username and password are valid. If it is not, it sends a response
    to the client saying that the username and password are not valid. */
    app.post("/api/auth", async (req, res) => {

        var usernameSubmission = req.body.username;
        var passwordSubmission = req.body.password;

        console.log("Logging in user: ", usernameSubmission);

        userObject = {username: usernameSubmission, password: passwordSubmission};
        
        const collection = db.collection("users");

        //count the num of username/password combo in database (should be 1 if valid, 0 if invalid)
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