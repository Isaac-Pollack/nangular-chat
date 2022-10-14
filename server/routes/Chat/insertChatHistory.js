module.exports = function (app, db) {

    // Takes the channel and chats from the request body and inserts them into the DB
    app.post("/api/insertChats", (req, res) => {

        var chatObj = { channel: req.body.channel, chats: req.body.chats }
        var query = { channel: req.body.channel };

        //check if history already exists
        db.collection('chats').find(query).toArray(function(err, result) {
            if (err) throw err;
            if (result.length != 0) {

                db.collection('chats').deleteOne(query, function(err) {
                    if (err) throw err;
                });
            }
        });

        db.collection('chats').insertOne(chatObj, function(err, result) {
            if (err) throw err;
            res.send(true);
        });
    });

}
