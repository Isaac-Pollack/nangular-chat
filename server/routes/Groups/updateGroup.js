module.exports = function (app, db) {

    /* This is the code that is run when the client sends a POST request to the server. It takes the
    query and update parameters from the request body and uses them to update the database. */
    app.post("/api/updateGroup", (req, res) => {
        var updateGroupFrom = req.body.query;
        var updateGroupTo = req.body.update;
        
        db.collection("groups").updateOne(updateGroupFrom, { $set: updateGroupTo }, function(err, result) {
            if (err) throw err;
            res.send(result);
        });
    });
}