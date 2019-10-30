var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('nhanvien/index')
});


router.get('/chuocxe', function(req, res, next) {
  res.send('/chuoc');
});


router.get('/tralai', function(req, res, next) {
  res.send('/tralai');
});


router.get('/camxe', function(req, res, next) {
 res.render('nhanvien/index');
});


module.exports = router;
