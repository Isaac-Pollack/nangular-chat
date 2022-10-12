module.exports = function (app, db) {

    /* This is a get request to the server. It is getting all the users from the database. */
    app.get('/api/getUsers', (req, res) => {
      var query = {};
      db.collection('users').find(query).toArray(function (err, result) {
        if (err) throw err;
        res.send(result);
      });
    });

  }