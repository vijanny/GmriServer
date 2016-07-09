/**
 * Created by vijanny on 2016/6/14.
 */
var express = require('express');
var router = express.Router();
var masterAppDb = require('../models/masterApp').masterAppEntity;
var devDb = require('../models/dev').devEntity;
var usersDb = require('../models/users').UserEntity;
var util = require('../util/util');

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('you are in  masterApp patch');
});


//TODO:MasterApp关联用户

router.post('/userRelationship', function (req, res, next) {

    var masterAppId = req.body.masterAppId;
    var userName = req.body.name;

    var userObjId = '';
    var masterAppObjId = '';

    if (!util.checkInput(masterAppId)|| !util.checkInput(userName)||typeof (masterAppId)=='undefined'||typeof (userName)=='undefined') {
        res.send({errorCode: -4, res: {message: '参数错误'}});
    }

    masterAppDb.findOne({masterAppMacId: masterAppId}, null, function (err, masterApp) {
        if (err) {//查询异常
            res.send({errorCode: -3, res: {message: '服务器内部错误'}});
            return;
        }
        if (!masterApp) {
            res.send({errorCode: -2, res: {message: '系统设备未初始化'}});
            return;
        }

        masterAppObjId = masterApp._id;

        usersDb.findOne({nickname: userName}, '_id', function (err, user) {
            if (err) {//查询异常
                res.send({errorCode: -3, res: {message: '服务器内部错误'}});
                return;
            }
            if (!user) {
                res.send({errorCode: -2, res: {message: '没有该用户'}});
                return;
            }
            userObjId = user._id;
            masterAppDb.update({_id:masterAppObjId},{$set:{userId:user._id}});
            usersDb.update({_id:user._id},{$set:{userId:masterAppObjId}});

        });

    });
});

//系统设备初始化
router.post('/init', function (req, res, next) {

    var masterAppId = req.body.masterAppId;

    if (!util.checkInput(masterAppId)||typeof (masterAppId)=='undefined') {
        res.send({errorCode: -4, res: {message: '参数错误'}});
        return;
    }

    masterAppDb
        .findOne({masterAppMacId: masterAppId}, null, function (err, masterApp) {
            if (err) {//查询异常
                res.send({errorCode: -3, res: {message: '服务器内部错误'}});
                return;
            }
            if (masterApp) {
                res.send({errorCode: -2, res: {message: '系统设备已初始化'}});
                return;
            }

            //初始化masterApp
            var initMasterApp = new masterAppDb({
                masterAppMacId: masterAppId
            });
            //调用实体的实例的保存方法
            initMasterApp.save(function (err, row) {
                if (err) {//服务器保存异常
                    res.send({errorCode: -3, res: {message: '服务器内部错误'}});
                    return;
                }
                res.send({errorCode: 0, res: ''});

            });
        });
});


//获取用户设备信息
router.post('/getDev', function (req, res, next) {

    var masterAppId = req.body.masterAppId;
    //var usersPwd = req.body.password;
    if (!util.checkInput(masterAppId)||typeof (masterAppId)=='undefined') {
        res.send({errorCode: -4, res: {message: '参数错误'}});
        return;
    }

    //确定该用户是否与该设备关联 masterAppMacId->devId->
    masterAppDb
        .findOne({masterAppMacId: masterAppId}, '_id', function (err, masterApp) {
            if (err) {//查询异常
                res.send({errorCode: -3, res: {message: '服务器内部错误'}});
                return;
            }
            if (!masterApp) {
                res.send({errorCode: -2, res: {message: '系统设备未初始化'}});
                return;
            }
            //获取设备信息
            devDb.find({masterAppId: masterApp._id}, 'uuid devName devType rang', function (err, dev) {
                if (err) {
                    res.send({errorCode: -3, res: {message: '服务器内部错误'}});
                    return;
                }
                if (!dev) {
                    res.send({errorCode: -1, res: {message: '没有设备关联'}});
                    return;
                }
                res.send({errorCode: 0, res: dev});
            });
        });
});
module.exports = router;