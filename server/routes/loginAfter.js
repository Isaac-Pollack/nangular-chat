//returns user data that matches the login form

module.exports = function(db,app) {
  app.post('/api/login', function(req,res){
  var u = req.body.email;
  var p = req.body.password;
  console.log(u);
  console.log(p);
  const collection = db.collection('users');
  collection.find({$and:[{'email':u}, {'password': p}]}).toArray(function(err, result) {
      if (err) throw err
      console.log(result);
      if (result.length === 0){
          res.send({error: "Incorrect Username or Password"});
      } else {
      res.send(result);
      }
  });
  });
}