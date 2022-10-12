module.exports = function (app, db) {

    // Post channel, check existence, insert. Otherwise send fake response.
    app.post("/api/insertChannel", (req, res) => {
        var channel = { title: req.body.title, groupName: req.body.groupName , members: req.body.members }

        var channelExists = false;

        // Does channel exist already
        var query = { title: req.body.title };
        db.collection('channels').find(query).toArray(function(err, result) {
            if (err) throw err;
            if (result.length != 0) {
                channelExists = true;
            }
        });

        if (!channelExists) {
            // Insert channel
            db.collection('channels').insertOne(channel, function(err, result) {
                if (err) throw err;
                res.send(true);
            });
        }
        else {
            res.send(false);
        }
    });
}