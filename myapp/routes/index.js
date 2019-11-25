var express = require('express');
var router = express.Router();
var mysql = require('sync-mysql')


//admin router {}


//user router{}


//function stuff
//DB base tool

function getConnect() {
  var connection = new mysql({
    host: "103.130.216.99",
    user: "gbikevie_baotm",
    password: "anhyeu12",
    database: 'gbikevie_gbikepawn'
  });
  return connection;
}
function db_query(str) {
  var connection = getConnect();
  result = connection.query(str);
  connection.dispose();
  return result;
}
function db_get_noti(role) {
  let noti = new Array();
  switch (role) {
    case 'admin': {
      // noti for admin
      queryStr = "SELECT * FROM `notification` "
      result = db_query(queryStr);
    } break;
    default: {
      // noti for user
      queryStr = "SELECT * FROM `user_notification` "
      result = db_query(queryStr);
    } break;
  }
  return noti;
}

//page tool
function checkLogin(req) {
  //check login ? {check if login true => return true, else return false, }
  if (req.session.login) {
    return true;
  } else {
    return false;
  }
}

function checkRole(req, res) {
  role = req.session.role;
  switch (role) {
    case 'admin': {
      view_admin(req, res);
    } break;
    case 'sale': {
      view_sale(req, res)
    } break;
    case 'tech': {
      view_tech(req, res)
    } break;
  }
}
//view page
function view_admin(req, res) {
  role = 'admin';
  //info notification
  _noti = db_get_noti(role);
  name = req.session.name;
  info = JSON.parse(req.session.info)
  res.render('index', { title: name, acc_name: info.name, acc_avatar: info.avatar, _noti })

}
function view_sale(req, res) {
  res.send('sale page')
  noti = db_get_noti('user');
}
function view_tech(req, res) {
  res.send('tech page')
  noti = db_get_noti('user');
}


router.get('/', function (req, res, next) {
  //check login
  if (checkLogin(req)) {
    checkRole(req, res);
  } else {
    res.redirect('/login?action=first')
  }
});
// router.get('/', function (req, res, next) {
//   if (req.session.login) {
//     //phan chia khu vuc role
//     role = req.session.role;
//     name = req.session.name;
//     info = JSON.parse(req.session.acc)
//     switch (role) {
//       case 'admin': {
//         //get notification
//         query = "SELECT * FROM `notification` "
//         var connection = getConnect();
//         noti = connection.query(query);
//         connection.dispose();

//         //tìm tất cả những noti mà account chưa xem
//         acc = info.name;
//         var _noti = new Array();
//         //đọc toàn bộ noti
//         for (i = 0; i < noti.length; i++) {
//           //tìm ra see
//           seeStr = noti[i].see;
//           if (seeStr == null) {
//             seeStr = "null";
//           }
//           if (seeStr.search(acc) >= 0) {
//             //co ket qua, khong hien thi
//           }
//           else {
//             //acc nay chua xem, hien thi
//             //lay ra account da sua tung string
//             noti[i].containt = (noti[i].containt).slice(0, 60) + " ...";
//             accEdit = noti[i].accEdit;

//             query = "SELECT * FROM `account` where user='" + accEdit + "'";

//             var connection = getConnect();
//             _accInfo = connection.query(query);
//             connection.dispose();


//             accInfo = JSON.parse(_accInfo[0].info);
//             noti[i].pic = accInfo.avatar;

//             //20/10/2019-20:53:13

//             dateStr = (noti[i].date).split("-")[0];
//             _dateStr = dateStr.split('/');
//             timeStr = (noti[i].date).split("-")[1];
//             _timeStr = timeStr.split(":");

//             var day, month, year, sec, min, hour;
//             day = _dateStr[0]; month = _dateStr[1]; year = _dateStr[2];
//             sec = _timeStr[2]; min = _timeStr[1]; hour = _timeStr[0];


//             var d1 = new Date();
//             //new Date(year, month, day, hours, minutes, seconds, milliseconds)
//             var d2 = new Date(year, month, day, hour, min, sec, 0);

//             str = diff(d1, d2);
//             noti[i].timeDiff = str;
//             _noti.push(noti[i]);
//           }
//         }
//         res.render('admin_1', { title: name, acc_name: info.name, acc_avatar: info.avatar, _noti })
//       } break;
//       case 'sale': {
//         query = "SELECT * FROM docam ORDER BY id DESC LIMIT 1;"
//         var connection = getConnect();
//         re = connection.query(query);
//         lastid = re[0].id;
//         connection.dispose();
//         res.render('nhanvien/index', { lastid: (parseInt(lastid) + 1), title: name, acc_name: info.name, acc_avatar: info.avatar })
//       } break;
//       case 'tech': {
//         res.render('tech', { title: name })
//       } break;
//     }
//   } else {
//     res.redirect('/login?action=first')
//   }
// });
router.get('/do_pawn_update', function (req, res) {
  strQuery = decodeURI(req.query.query);
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
  diff = decodeURI(req.query.diff);
  //UPDATE `docam` SET `ngaychuoc`=[value-8],`trinhtrang`=[value-9],`tienlai`=[value-11] WHERE 1
  strQuery = "UPDATE `docam` SET `ngaycam` = '" + ngaydonglai + "' ,`tienlai`=" + tienlai + ",`ghichu`='" + 'Đã đóng lãi : ' + ngaydonglai + " ' WHERE id=" + id
  var connection = getConnect();
  re = connection.query(strQuery);
  connection.dispose();

  res.send(id + "|" + tienlai + "|" + diff);

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
    req.session.info = _db.info;
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

//quanli
router.get('/quanli/nhanvien', function (req, res) {
  if (req.session.login) {
    //phan chia khu vuc role
    role = req.session.role;
    name = req.session.name;
    var connection = getConnect();
    result = connection.query('SELECT * FROM `account`');
    connection.dispose();
    var acc = result;
    var acc_info = new Array();
    for (i = 0; i < acc.length; i++) {
      obj = JSON.parse(acc[i].info)
      acc_info.push(obj);
    }

    //info all
    if (role == 'admin') {
      res.render('quanli/nhanvien', { title: name, acc_name: info.name, acc_avatar: info.avatar, account: acc, acc_info: acc_info });
    } else {
      res.redirect('/login?action=first')
    }

  } else {
    res.redirect('/login?action=first')
  }
});

router.get('profile', function (req, res) {
  if (req.session.login) {
    //phan chia khu vuc role
    role = req.session.role;
    name = req.session.name;
    id = req.query.id;
    var connection = getConnect();
    result = connection.query('SELECT * FROM account WHERE id=' + id);
    connection.dispose();
    var acc = result;
    var acc_info = new Array();
    for (i = 0; i < acc.length; i++) {
      obj = JSON.parse(acc[i].info)
      acc_info.push(obj);
    }

    //info all
    if (role == 'admin') {
      res.render('profile', { title: name, acc_name: info.name, acc_avatar: info.avatar, account: acc, acc_info: acc_info });
    } else {
      res.redirect('/login?action=first')
    }

  } else {
    res.redirect('/login?action=first')
  }
});
function diff(start, end) {

  var diff = end.getTime() - start.getTime();
  var hours = Math.floor(diff / 1000 / 60 / 60);
  diff -= hours * 1000 * 60 * 60;
  var minutes = Math.floor(diff / 1000 / 60);
  var seconds = Math.floor(diff / 1000) - 120;

  const diffTime = Math.abs(start - end);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  // If using time pickers with 24 hours format, add the below line get exact hours
  if (hours < 0)
    hours = hours + 24;

  return "Cách đây " + diffDays + " ngày, " + (hours <= 9 ? "0" : "") + hours + "h :" + (minutes <= 9 ? "0" : "") + minutes + "p :" + (seconds <= 9 ? "0" : "") + seconds + "s";
}
module.exports = router;

