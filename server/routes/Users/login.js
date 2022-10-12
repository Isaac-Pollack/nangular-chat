module.exports = function(app, db){

    //Returns a true or false re: credentials matching
    app.post("/api/auth", async (req, res) => {
        //Error Checking
        if (!req.body) {
            return res.sendStatus(400);
        }
    
        var usernameResult = req.body.username;
        var passwordResult = req.body.password;
    
        console.log("Logging in:", usernameResult);
        console.log("Password:", passwordResult);
    
        user = {username: usernameResult, password: passwordResult};
    
        const collection = db.collection('users');
    
        //0 means no user match
        collection.countDocuments((user), function (err, count) {
            if (count > 0) {
                res.send({'username': usernameResult, 'valid': true});
            }
            else {
                res.send({'valid': false});
            }
        });
    });

}