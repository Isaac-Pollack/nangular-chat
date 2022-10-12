module.exports = function (app, db) {

    /* This is the code that is executed when the user clicks the submit button on the signup page. It
    takes the information from the form and inserts it into the database. */
    app.post("/api/insertUser", (req, res) => {
        var userObj = { username: req.body.username, email: req.body.email, password: req.body.password, role: req.body.role};
        var uname = req.body.username;
        var userExists = false;

        //check if user already exists
        var query = { username: uname}; 
        db.collection('users').find(query).toArray(function (err, result) {
            if (err) throw err;
            if (result.length != 0){ //user already exists
                userExists = true;
            }
        });
              

        if (!userExists) {
            //insert the new user into db
            db.collection('users').insertOne(userObj, function(err, result) {
                if (err) throw err;
                res.send(true);
            });
        }
        else {
            res.send(false);
        }
    });

}