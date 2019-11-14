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
router.get('/do_pawn_update', function (req, res) {
  strQuery = decodeURI(req.query.query);
  console.log("------------------")
  console.log(strQuery);
  var connection = getConnect();
  re = connection.query((strQuery));
  connection.dispose();
  res.send('200');
});
router.get('/logout', function (req, res) {
  req.session.destroy();
  res.redirect('/login?action=first');
});

router.post('/upload_picture', function (req, res) {
  img = req.body.img;
  url = "./public/image_pawn/";
  name = url + decodeURI(req.body.name) + ".png";
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
  mondo = p.mondo;
  info = {};
  switch (mondo) {
    case "xemay": {
      info = {
        name: decodeURI(p.name),
        phone: decodeURI(p.phone),
        money: decodeURI(req.query.money).replace(/,/g, ''),
        ngaythe: decodeURI(p.ngaythe),
        ngaytoihan: decodeURI(p.ngaytoihan),
        mondo: {
          loaihang: "Xe máy",
          name: decodeURI(p.ipt_item_name_1),
          color: decodeURI(p.ipt_item_color),
          bienso: decodeURI(p.ipt_item_cavet),
          sale: decodeURI(p.sale),
          cmnd: decodeURI(p.cmnd),
          cmnd_date: decodeURI(p.cmnd_date),
        },
        laixuat: decodeURI(p.ipt_laixuat),
        ghichu: decodeURI(p.ghichu),
        urlpic: decodeURI(p.ipt_url),
      }
    } break;
    case "dienthoai": {
      info = {
        name: decodeURI(p.name),
        phone: decodeURI(p.phone),
        money: decodeURI(req.query.money).replace(/,/g, ''),
        ngaythe: decodeURI(p.ngaythe),
        ngaytoihan: decodeURI(p.ngaytoihan),
        mondo: {
          loaihang: "Điện thoại",
          name: decodeURI(p.ipt_item_name_1),
          color: decodeURI(p.ipt_item_color),
          sale: decodeURI(p.sale),
          cmnd: decodeURI(p.cmnd),
          cmnd_date: decodeURI(p.cmnd_date),
        },
        laixuat: decodeURI(p.ipt_laixuat),
        ghichu: decodeURI(p.ghichu),
        urlpic: decodeURI(p.ipt_url),
      }
    } break;
    case "xedien": {
      info = {
        name: decodeURI(p.name),
        phone: decodeURI(p.phone),
        money: decodeURI(req.query.money).replace(/,/g, ''),
        ngaythe: decodeURI(p.ngaythe),
        ngaytoihan: decodeURI(p.ngaytoihan),
        mondo: {
          loaihang: "Xe điện",
          name: decodeURI(p.ipt_item_name_1),
          color: decodeURI(p.ipt_item_color),
          sale: decodeURI(p.sale),
          cmnd: decodeURI(p.cmnd),
          cmnd_date: decodeURI(p.cmnd_date),
        },
        laixuat: decodeURI(p.ipt_laixuat),
        ghichu: decodeURI(p.ghichu),
        urlpic: decodeURI(p.ipt_url),
      }
    } break;
    default: {
      info = {
        name: decodeURI(p.name),
        phone: decodeURI(p.phone),
        money: decodeURI(req.query.money).replace(/,/g, ''),
        ngaythe: decodeURI(p.ngaythe),
        ngaytoihan: decodeURI(p.ngaytoihan),
        mondo: {
          loaihang: "Khác",
          name: decodeURI(p.ipt_item_name_1),
          color: decodeURI(p.ipt_item_color),
          sale: decodeURI(p.sale),
          cmnd: decodeURI(p.cmnd),
          cmnd_date: decodeURI(p.cmnd_date),
        },
        laixuat: decodeURI(p.ipt_laixuat),
        ghichu: decodeURI(p.ghichu),
        urlpic: decodeURI(p.ipt_url),
      }
    }
  }

  //insert to db
  strQuery = "INSERT INTO docam " +
    "(`id`,`ten`, `sodienthoai`, `mondo`, `sotien`, `hinhanh`, `ngaycam`, `ngaychuoc`, `trinhtrang`, `tienno`, `tienlai`, `laixuat`, `ghichu`) VALUES" +
    " (0,'" + info.name + "', '" + info.phone + "', '" + JSON.stringify(info.mondo) + "', " + info.money + ",'" + info.urlpic + "', '" + info.ngaythe + "', '" + info.ngaytoihan + "','Chưa chuộc', 0, 0," + info.laixuat + ", '" + info.ghichu + "')";
  //res.redirect('nhanvien/index')
  var connection = getConnect();
  re = connection.query(strQuery);
  connection.dispose();
  res.send('200')

});
router.get("/do_pawn_notifi_insert", function (req, res) {
  strQuery = decodeURI(req.query.query);
  var connection = getConnect();
  re = connection.query(strQuery);
  connection.dispose();
  res.send(strQuery)
});
router.get("/do_pawn_chuocdo", function (req, res) {
  id = decodeURI(req.query.id);
  ngaychuoc = decodeURI(req.query.ngaychuoc);
  tinhtrang = "Đã chuộc";
  tienlai = decodeURI(req.query.tienlai);

  //UPDATE `docam` SET `ngaychuoc`=[value-8],`trinhtrang`=[value-9],`tienlai`=[value-11] WHERE 1
  strQuery = "UPDATE `docam` SET `ngaychuoc`='" + ngaychuoc + "',`trinhtrang`='" + tinhtrang + "',`tienlai`=" + tienlai + " WHERE id=" + id
  var connection = getConnect();
  re = connection.query(strQuery);
  connection.dispose();
  res.send(id + "|" + tienlai);
});

router.get("/do_pawn_donglai", function (req, res) {

  id = decodeURI(req.query.id);
  ngaydonglai = decodeURI(req.query.ngaydonglai);
  tienlai = decodeURI(req.query.tienlai);
  diff=  decodeURI(req.query.diff);
  //UPDATE `docam` SET `ngaychuoc`=[value-8],`trinhtrang`=[value-9],`tienlai`=[value-11] WHERE 1
  strQuery = "UPDATE `docam` SET `ngaycam` = '"+ngaydonglai+"' ,`tienlai`=" + tienlai + ",`ghichu`='"+'Đã đóng lãi : '+ngaydonglai+" ' WHERE id=" + id
  var connection = getConnect();
  re = connection.query(strQuery);
  connection.dispose();

  res.send(id + "|" + tienlai+"|"+diff);

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
    item: item
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
  _re.replace(/\\/g, '');
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

