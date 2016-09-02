/**
 * Created by vijanny on 2016-08-15.
 */
var express = require('express');
var router = express.Router();
var devDb = require('../models/dev').devEntity;
var cateDb = require('../models/category').categoryEntity;
var masterAppDb = require('../models/masterApp').masterAppEntity;
var sceneDb = require('../models/scene').sceneEntity;
var util = require('../util/util');


//新增场景
router.post('/addScene', function (req, res, next) {
    var sceneStr = req.body.scene;
    var masterAppId = req.body.masterAppId;

    console.log(req.body);
    if (typeof(sceneStr) == "undefined" || typeof(masterAppId) == "undefined") {
        res.send({errorCode: -4, res: {message: 'scene或masterAppId undefined'}});
        return;
    }

    var scene = JSON.parse(sceneStr);
    scene.masterAppMacId = "";
    scene.masterAppMacId = masterAppId;

    //密码加密方式,取决于不同应用需求,此处不做加密
    var registerScene = new sceneDb(scene);
    //调用实体的实例的保存方法
    registerScene.save(function (err, row) {
        if (err) {//服务器保存异常
            console.log(err);
            res.send({errorCode: -3, res: {message: '服务器内部错误', errMassage: err}});
            return;
        }
        res.send({errorCode: 0, res: ""});
    });
});


//删除场景
router.post('/deleteScene', function (req, res, next) {
    var sceneId = req.body.sceneId;
    console.log(req.body);
    if (typeof(sceneId) == "undefined") {
        res.send({errorCode: -4, res: {message: 'sceneId undefined'}});
        return;
    }
    sceneId=sceneId.substring(1,sceneId.length-1);//去除多余的字符
    var sceneIdArr =sceneId.split(',');
    console.log(sceneIdArr);
    sceneDb.remove({sceneId: {'$in': sceneIdArr}}, function (err) {
        if (err) {
            res.send({errorCode: -3, res: {message: '服务器内部错误',errMassage:err}});
            return;
        }
        res.send({errorCode: 0, res: ''});
    });
});

//修改场景
router.post('/modifyScene', function (req, res, next) {
    var sceneStr = req.body.scene;
    var masterAppId = req.body.masterAppId;

    console.log(req.body);
    if (typeof(sceneStr) == "undefined" || typeof(masterAppId) == "undefined") {
        res.send({errorCode: -4, res: {message: 'scene或masterAppId undefined'}});
        return;
    }
    var scene = JSON.parse(sceneStr);
    sceneDb.update({sceneId: scene.sceneId}, {'$set': scene}, function (err, numberAffected, raw) {
        if (err) {
            res.send({errorCode: -3, res: {message: '服务器内部错误',errMassage:err}});
            return;
        }
        res.send({errorCode: 0, res: ''});
    });
});
//查询场景
router.post('/getSceneInfo', function (req, res, next) {
    var sceneId = req.body.sceneId;
    if (typeof(sceneId) == "undefined") {
        res.send({errorCode: -4, res: {message: 'sceneId undefined'}});
        return;
    }
    sceneDb.findOne({sceneId: sceneId}, null, function (err, scene) {
        if (err) {
            res.send({errorCode: -3, res: {message: '服务器内部错误',errMassage:err}});
            return;
        }
        if (!scene) {
            res.send({errorCode: -1, res: {message: '没有设备关联'}});
            return;
        }
        res.send({errorCode: 0, res: scene});
    });
});

//根据MasterAppId查询场景
router.post('/getSceneInfoByMaster', function (req, res, next) {
    var masterAppMacId = req.body.masterAppId;
    if (typeof(masterAppMacId) == "undefined") {
        res.send({errorCode: -4, res: {message: 'masterAppId undefined'}});
        return;
    }
    sceneDb.find({masterAppMacId: masterAppMacId}, null, function (err, scene) {
        if (err) {
            res.send({errorCode: -3, res: {message: '服务器内部错误',errMassage:err}});
            return;
        }
        if (!scene) {
            res.send({errorCode: -1, res: {message: '没有场景关联'}});
            return;
        }
        res.send({errorCode: 0, res: scene});
    });
});

module.exports = router;