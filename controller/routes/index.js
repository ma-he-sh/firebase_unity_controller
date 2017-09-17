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

//create the user
var query = require('./query');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Index' });
});

router.get('/api', function(req, res, next) {
  res.render('mobile', { 
    title: 'API', 
    user: req.query.name
  });
});


//create the user onlogin
router.get('/join', function(req, res, next){
  var name = Date.now();


  // var xmlHttp = new XMLHttpRequest();
  // xmlHttp.onreadystatechange = function() { 
  //     if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
  //         callback(xmlHttp.responseText);
  // }
  // xmlHttp.open("GET", "https://cloud.estimote.com/indoor/locations/:877408dcf87210b3c5e0466120fea339", true); // true for asynchronous 
  // xmlHttp.send(null);

  // let inRange = xmlHttp.responseText.position;
  // console.log(inRange);

  if(query.writedata(db, name)){
    res.redirect('/api?name=' + name);
  }else{
    res.redirect('/');
  }
});

// router.get('/write', function(req, res, next) {
//   var user = Math.floor(Date.now());
//   var name = 'Mahesh Ranaweera';
//   if(query.writedata(db, user, name)){
//       // res.redirect('/');
//       //getdata(db, res);
//   }else{
//       res.render('index',{
//           title: "Error"
//       })
//   }
// });


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
      res.render('index',{
          title: childdata
      })
  })
}


module.exports = router;
