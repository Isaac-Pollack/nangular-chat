module.exports = function (app, db) {

    // get the channels collection
    app.get('/api/getChannels', (req, res) => {
      var query = {};
      db.collection('channels').find(query).toArray(function (err, result) {
        if (err) throw err;
        res.send(result);
      });
    });

}