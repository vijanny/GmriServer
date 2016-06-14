var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('you are in  user patch');
});

//�û�ע��
router.post('/singUp',function(req,res,next){
  //console.log(req.query);
  //var ret={name:'vijanny',age:32};
  //res.send(ret);
  if (req.body) {
    console.log('have body');
    //����ȷ���� json ��ʽ��post����
    res.send({"status": "success", "name": req.body.name, "age": req.body.age});
  } else {
    console.log('no body');
    //������ȷ����json ��ʽ��post����
    var body = '', jsonStr;
    req.on('data', function (chunk) {
      body += chunk; //��ȡ������ת��Ϊ�ַ���
    });
    req.on('end', function () {
      //��ȡ������������ת����body�ַ��������� JSON ��ʽ
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
//�û���¼
router.post('/login',function(req,res,next){

});


module.exports = router;
