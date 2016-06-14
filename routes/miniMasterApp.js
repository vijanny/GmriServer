/**
 * Created by vijanny on 2016/6/14.
 */
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('you are in  user miniMasterApp');
});

//用户注册
router.post('/singUp',function(req,res,next){

});
//用户登录
router.post('/login',function(req,res,next){

});

module.exports = router;