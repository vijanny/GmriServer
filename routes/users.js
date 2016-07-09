var express = require('express');
var router = express.Router();
var usersDb = require('../models/users').UserEntity;
var masterAppDb = require('../models/masterApp').masterAppEntity;
var util = require('../util/util');

//用户注册
router.post('/signUp', function (req, res, next) {

    if (req.body) {
        console.log('have body');
        var usersName = req.body.name;
        var usersPwd = req.body.password;
        if( typeof(usersName) == "undefined"||typeof(usersPwd) == "undefined"||!util.checkInput(usersName)||!util.checkInput(usersPwd)){
            res.send({errorCode:-4,res:{message:'用户名或密码错误'}});
            return;
        }
        usersDb.findOne({nickname: usersName}, '_id', function (err, user) {
            if (err) {//查询异常
                res.send({errorCode: -3, res: {message: '服务器内部错误'}});
                return;
            }

            if (user) {//手机号已注册
                res.send({errorCode: -2, res: {message: '用户已注册'}});
                return;
            }
            //密码加密方式,取决于不同应用需求,此处不做加密
            var registerUser = new usersDb({
                password: usersPwd,
                nickname: usersName
            });

            //调用实体的实例的保存方法
            registerUser.save(function (err, row) {
                if (err) {//服务器保存异常
                    res.send({errorCode: -3, res: {message: '服务器内部错误'}});
                    return;
                }
                res.send({errorCode: 0, res: ''});

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
            jsonStr ? res.send({
                "status": "success",
                "name": jsonStr.name,
                "age": jsonStr.age
            }) : res.send({"status": "error"});
        });
    }

});
//用户登录
router.post('/login', function (req, res, next) {

    var usersName = req.body.name;
    var usersPwd = req.body.password;
    if( typeof(usersName) == "undefined"||typeof(usersPwd) == "undefined"||!util.checkInput(usersName)||!util.checkInput(usersPwd)){
        res.send({errorCode:-4,res:{message:'用户名或密码错误'}});
        return;
    }
    usersDb.findOne({nickname: usersName}, null, function (err, user) {
        if (err) {//查询异常
            res.send({errorCode: -3, res: {message: '服务器内部错误'}});
            return;
        }

        if (!user) {//手机号已注册
            res.send({errorCode: -2, res: {message: '用户未注册'}});
            return;
        }
        console.log('login:/r/n' + JSON.stringify(req.body));
        console.log('user:/r/n' + user);
        if (user.password == usersPwd) {
            req.session.user = user;
            res.cookie('user', req.session.user.nickname, {expires: new Date(Date.now() + 900000), httpOnly: false});
            res.send({errorCode: 0});
            //res.send("登录成功");
            //res.redirect('/managers/control/index.html');
        } else {
            res.send({errorCode: -1, res: {message: '密码错误'}});
        }


        //密码加密方式,取决于不同应用需求,此处不做加密

    });
});

//获取用户信息
router.post('/getUserInf', function (req, res, next) {

    var usersName = req.body.name;
    //var usersPwd = req.body.password;
    if( typeof(usersName) == "undefined"||!util.checkInput(usersName)){
        res.send({errorCode:-4,res:{message:'用户名或密码错误'}});
        return;
    }
    usersDb.findOne({nickname: usersName}, null, function (err, user) {
        if (err) {//查询异常
            res.send({errorCode: -3, res: {message: '服务器内部错误'}});
            return;
        }
        if (!user) {//手机号已注册
            res.send({errorCode: -2, res: {message: '用户未注册'}});
            return;
        }

        res.send({
            errorCode: 0, res: {
                portraitUri: user.portraitUri,//头像
                password: user.password,//密码
                nickname: user.nickname,//昵称
                mobile: user.mobile,//手机(登陆用户名)
                sex: user.sex,//0:女 1:男
                weChat: user.weChat
            }
        });
    });
});




router.post('/getUserMasterApp', function (req, res, next) {

    var usersName = req.body.name;
    if( typeof(usersName) == "undefined"||!util.checkInput(usersName)){
        res.send({errorCode:-4,res:{message:'用户名或密码错误'}});
        return;
    }
    //确定该用户是否与该设备关联 masterAppMacId->devId->

    usersDb.findOne({nickname: usersName}, null, function (err, user) {
        if (err) {//查询异常
            res.send({errorCode: -3, res: {message: '服务器内部错误'}});
            return;
        }
        if (!user) {
            res.send({errorCode: -2, res: {message: '用户不存在'}});
            return;
        }
        masterAppDb
            .find({userId: user._id},'location name masterAppMacId', function (err, masterApp) {
                if (err) {//查询异常
                    res.send({errorCode: -3, res: {message: '服务器内部错误'}});
                    return;
                }

                if (!masterApp) {
                    res.send({errorCode: -1, res: {message: '该用户没有masterApp系统关联'}});
                    return;
                }

                res.send({errorCode: 0, res: masterApp});
            });
    });

});


module.exports = router;
