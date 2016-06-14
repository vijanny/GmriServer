var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('you are in  user patch');
});

//用户注册
router.post('/singUp',function(req,res,next){
  //console.log(req.query);
  //var ret={name:'vijanny',age:32};
  //res.send(ret);
  if (req.body) {
    console.log('have body');
    //能正确解析 json 格式的post参数
    res.send({"status": "success", "name": req.body.name, "age": req.body.age});
  } else {
    console.log('no body');
    //不能正确解析json 格式的post参数
    var body = '', jsonStr;
    req.on('data', function (chunk) {
      body += chunk; //读取参数流转化为字符串
    });
    req.on('end', function () {
      //读取参数流结束后将转化的body字符串解析成 JSON 格式
      try {
        jsonStr = JSON.parse(body);
      } catch (err) {
        jsonStr = null;
      }
      console.log(jsonStr);
      jsonStr ? res.send({"status":"success", "name": jsonStr.name, "age": jsonStr.age}) : res.send({"status":"error"});
    });
  }
});
//用户登录
router.post('/login',function(req,res,next){

});


module.exports = router;
