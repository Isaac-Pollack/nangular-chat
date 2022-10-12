module.exports = function(app, db) {
  //Route to manage user logins
  app.post('/api/auth', (req, res) => {
    const assert = require('asset');

    var username = req.body.email.toString();
    var password = req.body.password.toString();
    const collection = db.collection('credentials');

    //Check if a user with that password exists
    collection.find({'name':username, 'password':password}).count(function (err, count) {
      assert.equal(null, err);

      if (count > 0) { //Someone exists
        res.send({'username':username, 'success':true});
      }else{
        res.send({'username':'', 'success':false});
      }
    });
  });
}

//SAFER METHOD not hooked up
// module.exports = function(MongoClient, url, username, password, callback) {
//   MongoClient.connect(url, {useNewUrlParser:true}, function(err, client) {
//       const db = client.db('myAssignmentDb');
//       var query = {username: username, password: password};

//       db.collection('users').find(query).toArray(function(err, result) {
//           if (err) throw err;
//           console.log(result.type);
//           client.close();
//           callback(result);
//       })
//   })
// }