module.exports = function (app, db) {

    //Check if channel exists, if not insert into DB
    app.post("/api/insertChannel", (req, res) => {
        var channelObj = { title: req.body.title, groupName: req.body.groupName , members: req.body.members }

        var channelExists = false;


        //Check existance
        var query = { title: req.body.title };
        db.collection('channels').find(query).toArray(function(err, result) {
            if (err) throw err;
            if (result.length != 0) {
                channelExists = true;
            }
        });

        if (!channelExists) {
            //Insert
            db.collection('channels').insertOne(channelObj, function(err, result) {
                if (err) throw err;
                res.send(true);
            });
        }
        else {
            res.send(false);
        }
    });
}
