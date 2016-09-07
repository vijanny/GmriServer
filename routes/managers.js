/**
 * Created by vijanny on 2016/6/14.
 */
var express = require('express');
var router = express.Router();
var managersDb = require('../models/managers').managersEntity;
var util = require('../util/util');



router.use(function (req, res, next) {
    if(req.path == '/index.html'){
        if(req.session.user == undefined){
            res.redirect("/managers/login.html");

        }
        else{
            res.cookie('user', req.session.user.nickname, { expires: new Date(Date.now() + 900000), httpOnly: false });
            //res.redirect("/managers/index.html");
            next();
        }
    }else{
        next();
    }

});
/* GET users listing. */
router.get('/', function(req, res, next) {

    console.log('req: '+JSON.stringify(req.session));

    if(req.session.user == undefined){
        res.redirect("/managers/login.html");
    }
    else{
        res.cookie('user', req.session.user.nickname, { expires: new Date(Date.now() + 900000), httpOnly: false });
        res.redirect("/managers/index.html");
    }
    //
    //res.render("home",{title:'Home'});         //已登录则渲染home页面
    //res.send('you are in  managers patch');
});
//router.get('/index.html', function(req, res, next) {
//
//    console.log('req: '+JSON.stringify(req.session));
//
//    if(req.session.user == undefined){
//        res.redirect("/managers/login.html");
//    }
//    else{
//        res.cookie('user', req.session.user.nickname, { expires: new Date(Date.now() + 900000), httpOnly: false });
//        res.redirect("/managers/index.html?");
//    }
//    //
//    //res.render("home",{title:'Home'});         //已登录则渲染home页面
//    //res.send('you are in  managers patch');
//});
//router.get('/Control',express.static( '../public/managers'));




//用户注册
router.post('/signUp',function(req,res,next){

    if (req.body) {

        console.log('have body');
        var managersName = req.body.name;
        var managersPwd = req.body.password;

        if( typeof(managersName) == "undefined"||typeof(managersPwd) == "undefined"||!util.checkInput(managersName)||!util.checkInput(managersPwd)){
            res.send({errorCode:-4,res:{message:'用户名或密码错误'}});
            return;
        }
        managersDb.findOne({nickname:managersName}, '_id', function (err, user) {
            if (err) {//查询异常
                res.send({errorCode:-3,res:{message:'服务器内部错误'}});
                return;
            }

            if (user) {//手机号已注册
                res.send({errorCode:-2,res:{message:'用户已注册'}});
                return;
            }
            //密码加密方式,取决于不同应用需求,此处不做加密
            var registerUser = new managersDb({
                password: managersPwd,
                nickname: managersName
            });
            //调用实体的实例的保存方法
            registerUser.save(function (err, row) {
                if (err) {//服务器保存异常
                    res.send({errorCode:-3,res:{message:'服务器内部错误'}});
                    return;
                }
                res.send({errorCode:0,res:{url:'login.html'}});

            });

        });

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



    var managersName = req.body.name;
    var managersPwd = req.body.password;
    console.log('login name: '+managersName+' ; pwd :'+managersPwd);


    if( typeof(managersName) == "undefined"||typeof(managersPwd) == "undefined"||!util.checkInput(managersName)||!util.checkInput(managersPwd)){
        res.send({errorCode:-4,res:{message:'用户名或密码错误'}});
        return;
    }
    managersDb.findOne({nickname:managersName}, null, function (err, user) {
        if (err) {//查询异常
            res.send({errorCode:-3,res:{message:'服务器内部错误'}});
            return;
        }

        if (!user) {//手机号已注册
            res.send({errorCode:-2,res:{message:'用户未注册'}});
            return;
        }
        console.log('login:/r/n'+JSON.stringify(req.body));
        console.log('user:/r/n'+user);
        if(user.password==managersPwd){
            req.session.user = user;
            res.cookie('user', req.session.user.nickname, { expires: new Date(Date.now() + 900000), httpOnly: false });
             res.send({errorCode:0,res:{url:'index.html'}});
            //res.send("登录成功");
            //res.redirect('/managers/control/index.html');
        }else{
            res.send({errorCode:-1,res:{message:'密码错误'}});
        }


        //密码加密方式,取决于不同应用需求,此处不做加密

    });
});
/* GET logout page. */
router.get("/logout",function(req,res){    // 到达 /logout 路径则登出， session中user,error对象置空，并重定向到根路径
    req.session.user = null;
    res.redirect("./");
});

module.exports = router;