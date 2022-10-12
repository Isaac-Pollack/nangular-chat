module.exports = function (app, db) {

    //Return groups collection
    app.get('/api/getGroups', (req, res) => {
      var query = {};

      db.collection('groups').find(query).toArray(function (err, result) {
        if (err) throw err;
        res.send(result);
      });
    });
    
}