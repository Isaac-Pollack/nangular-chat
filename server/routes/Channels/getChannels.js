module.exports = function (app, db) {

    //Requests a collection from DB
    app.get('/api/getChannels', (req, res) => {
      var query = {};
      db.collection('channels').find(query).toArray(function (err, result) {
        if (err) throw err;
        res.send(result);
      });
    });

}
