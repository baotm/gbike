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
    query = "SELECT id FROM docam ORDER BY id DESC LIMIT 1;"
    var connection = getConnect();
    re = connection.query(query);
    lastid = re[0].id;
    connection.dispose();

    switch (role) {
      case 'admin': {
        res.render('admin_1', { title: name, acc_name: info.name, acc_avatar: info.avatar })
      } break;
      case 'sale': {
        res.render('nhanvien/index', { lastid: (parseInt(lastid) + 1), title: name, acc_name: info.name, acc_avatar: info.avatar })
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

router.post('/upload_picture', function (req, res) {
  img = req.body.img;
  url = "./public/image_pawn/";
  name = url + decodeURI(req.body.name) + ".png";
  console.log(name)
  var base64Data = img.replace(/^data:image\/jpeg;base64,/, "");

  require("fs").writeFile(name, base64Data, 'base64', function (err) {
  });

  res.redirect('/upload_picture?name=' + req.body.name)
});
router.get('/upload_picture', function (req, res) {
  res.send(req.query.name)
});
router.get('/pawn_submit', function (req, res) {

  p = req.query;
  info = {
    name: decodeURI(p.name),
    phone: decodeURI(p.phone),
    money: decodeURI(req.query.money).replace(/,/g,''),
    sale: decodeURI(p.sale),
    cmnd: decodeURI(p.cmnd),
    cmnd_date: decodeURI(p.cmnd_date),
    ngaythe: decodeURI(p.ngaythe),
    ngaytoihan: decodeURI(p.ngaytoihan),
    mondo: {
      name: decodeURI(p.ipt_item_name),
      color: decodeURI(p.ipt_item_color),
      bienso: decodeURI(p.ipt_item_cavet)
    },
    laixuat: decodeURI(p.ipt_laixuat),
    ghichu: decodeURI(p.ghichu),
    urlpic:decodeURI(p.ipt_url),
  }
  res.send(info)
  //res.redirect('nhanvien/index')


});
router.get('/bill', function (req, res) {
  name = req.query.name;
  phone = req.query.phone;
  money = req.query.money;
  sale = req.query.sale;
  cmnd = req.query.cmnd;
  cmnd_date = req.query.cmnd_date;
  date_p = req.query.date_p;
  item_name = req.query.item_name;
  item_color = req.query.item_color;
  item_tinhtrang = req.query.tinhtrang;
  laixuat = req.query.laixuat;
  ghichu = req.query.ghichu;
  cavet = req.query.cavet;
  item = req.query.item;
  url = "image_pawn/" + req.query.url + ".png"

  res.render('bill', {
    id: 1,
    name: name,
    phone: phone,
    money: money,
    cmnd_date: cmnd_date,
    cmnd: cmnd,
    sale: sale,
    date_p: date_p,
    item_name: item_name,
    item_color: item_color,
    item_tinhtrang: item_tinhtrang,
    laixuat: laixuat,
    ghichu: ghichu,
    cavet: cavet,
    url: url,
    item:item
  });
})
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
  id = req.query.id;
  var connection = getConnect();
  re = connection.query('SELECT * FROM docam WHERE id=' + id);
  connection.dispose();
  res.send(re);
})

router.get('/ajax_pawn_item_get_all', function (req, res) {
  var connection = getConnect();
  _re = '{"data":';
  re = connection.query('SELECT * FROM docam');
  connection.dispose();
  _re += JSON.stringify(re);
  _re += '}';
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

