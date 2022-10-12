module.exports = function (app, db) {

    // Delete chat history from DB
    app.post("/api/deleteChats", (req, res) => {
        
        var query = { channel: req.body.channel };

        // Check for existence
        db.collection('chats').find(query).toArray(function(err, result) {
            if (err) throw err;
            if (result.length != 0) {
                db.collection('chats').deleteOne(query, function(err) {
                    if (err) throw err;
                    res.send(true);
                });
            }
        });
        
    });

}