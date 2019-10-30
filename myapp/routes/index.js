var express = require('express');
var router = express.Router();
var mysql = require('sync-mysql')

/* GET home page. */
function getConnect() {
  var connection = new mysql({
    host: "37.59.55.185",
    user: "VSJKeJDSNR",
    password: "blWm7N1F8T",
    database: 'VSJKeJDSNR'
  });
  return connection;
}

router.get('/', function (req, res, next) {
  if (req.session.login) {
    //phan chia khu vuc role
    role = req.session.role;
    name = req.session.name;
    info = JSON.parse(req.session.acc)

    switch (role) {
      case 'admin': {
        res.render('admin', { title: name, acc_name: info.name, acc_avatar: info.avatar })
      } break;
      case 'sale': {
        res.render('nhanvien/index',{ title: name, acc_name: info.name, acc_avatar: info.avatar })
      } break;
      case 'tech': {
        res.render('tech', { title: name })
      } break;
    }
  } else {
    res.redirect('/login?action=first')
  }
});
router.get('/logout', function (req, res) {
  req.session.destroy();
  res.redirect('/login?action=first');
});
router.post('/checklogin', function (req, res) {

  user = req.body.user;
  pass = req.body.pass;
  db = getAccount(user, pass);
  if (db.length > 0) {
    _db = db[0];
    req.session.login = true;
    req.session.acc = _db.info;
    req.session.role = _db.role_id;
    req.session.name = _db.user;
    req.session.acc = _db.info;
    res.redirect('/')
  } else {
    res.redirect('/login?action=loginfail')
  }

});
function getAccount(user, pass) {
  var connection = getConnect();
  res = connection.query('SELECT * FROM account WHERE user="' + user + '" and password="' + pass + '"');
  connection.dispose();
  return res;
}
router.get('/ajax_pawn_item_get', function (req, res) {
  id =req.query.id;
  var connection = getConnect();
  re = connection.query('SELECT * FROM docam WHERE id='+id);
  connection.dispose();
  res.send(re);
})

router.get('/ajax_pawn_item_get_all', function (req, res) {
  var connection = getConnect();
  _re = '{"data":';
  re = connection.query('SELECT * FROM docam');
  connection.dispose();
  _re+=JSON.stringify(re);
  _re+='}';
  res.send(_re);
})


router.get('/login', function (req, res) {
  act = req.query.action;

  if (req.session.login) {
    res.render('login', {
      msg: 'Bạn Đã đăng nhập - vui lòng đăng xuất'
    })
  }
  if (act != null) {
    switch (act) {
      case "first": {
        res.render('login', {
          msg: 'Have good day!!!'
        })
      } break;
      case "loginfail": {
        res.render('login', {
          msg: 'Sai tên đăng nhập hoặc mật khẩu'
        })
      } break;
        ;

    }

  } else {
    res.render('login?action=first')
  }


})


module.exports = router;

