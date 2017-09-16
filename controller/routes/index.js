var express = require('express');
var router = express.Router();
const firebase = require('firebase');
var  appdb = require('./config');

//set the firebase
var config = {
  apiKey: appdb.configdata.apiKey,
  authDomain: appdb.configdata.authDomain,
  databaseURL: appdb.configdata.databaseURL,
  projectId: appdb.configdata.projectId,
  storageBucket: appdb.configdata.storageBucket,
  messagingSenderId: appdb.configdata.messagingSenderId
};
const conn = firebase.initializeApp(config);
var db = firebase.database();
//import the query
var query = require('./query');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/api', function(req, res, next) {
  res.render('index', { title: 'API' });
});

router.get('/write', function(req, res, next) {
  var user = Math.floor(Date.now());
  var name = 'Mahesh Ranaweera';
  if(query.writedata(db, user, name)){
      // res.redirect('/');
      getdata(db, res);
  }else{
      res.render('index',{
          title: "Error"
      })
  }
});


///read data
function getdata(db, res){
  var childdata;

  var data = db.ref('/users')
  data.on('value', function(user){
      user.forEach(function(child){
          var collection = {
              name: child.val().username,
              id : child.val().id
          }
          childdata += JSON.stringify(collection)
          //console.log(childdata)
      })
      res.json({
          users: childdata
      })
  })
}


module.exports = router;
