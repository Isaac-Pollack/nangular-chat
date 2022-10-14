module.exports = function (app, db) {

    // Deletes channel from DB
    app.post("/api/deleteChannel", (req, res) => {
        var query = { title: req.body.title };
        console.log("deleting channel: ", req.body.title);
        db.collection("channels").deleteOne(query, function(err) {
            if (err) throw err;
            res.send(true);
        });
    });

}
