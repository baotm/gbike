var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  if (req.session.login) {
    //phan chia khu vuc role
    role = req.session.role;
    name = req.session.name;
    avatar = req.session.acc.avatar;
    switch (role) {
      case 'admin': {
        res.render('admin', { title: name,acc_name:name,acc_avatar:avatar })
      } break;
      case 'sale': {
        res.render('sale', { title: name })
      } break;
      case 'tech': {
        res.render('tech', { title: name })
      } break;
    }
  } else {
    res.redirect('/login')
  }
});
router.get('/logout',function(req,res){
  req.session.destroy();
res.redirect('/login');
});
router.post('/checklogin', function (req, res) {

  user = req.body.user;
  pass = req.body.pass;

  db = getUserNameFromDB(user, pass);

  if (db != false) {
    //save session
    req.session.login = true;
    req.session.acc = db.info;
    req.session.role = db.role;
    req.session.name = db.user;
    res.redirect('/')
  } else {
    res.send('wrong')
  }

});
router.get('/login', function (req, res) {
  res.render('login');
})
function getUserNameFromDB(user, pass) {
  _user = 'bao';
  _pass = '123';
  if (_user == user && _pass == pass) {
    return {
      user: 'bao',
      pass: '123',
      role: 'admin',
      info: {
        phone: '3232',
        avatar:'https://colorlib.com/polygon/gentelella/images/img.jpg'
      }
    }
  } else {
    return false;
  }

}
module.exports = router;

