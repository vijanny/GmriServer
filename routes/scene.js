/**
 * Created by vijanny on 2016-08-15.
 */
var express = require('express');
var router = express.Router();
var devDb = require('../models/dev').devEntity;
var cateDb = require('../models/category').categoryEntity;
var masterAppDb = require('../models/masterApp').masterAppEntity;
var sceneDb = require('../models/scene').masterAppEntity;
var util = require('../util/util');



//新增场景
router.post('/addScene', function (req, res, next) {
    var scene = req.body.scene;
    var masterAppId = req.body.masterAppId;
    scene.masterAppMacId = masterAppId;

    //密码加密方式,取决于不同应用需求,此处不做加密
    var registerScene = new sceneDb(scene);
    //调用实体的实例的保存方法
    registerScene.save(function (err, row) {
        if (err) {//服务器保存异常
            res.send({errorCode:-3,res:{message:'服务器内部错误'}});
            return;
        }
        res.send({errorCode:0,res:""});
    });
});


//删除场景
router.post('/deleteScene', function (req, res, next) {
    var sceneId = req.body.sceneId;

    sceneDb.remove({sceneId:sceneId},function(err){
        if (err) {
            res.send({errorCode: -3, res: {message: '服务器内部错误'}});
            return;
        }
        res.send({errorCode: 0, res: ''});
    });
});

//修改场景
router.post('/modifyScene', function (req, res, next) {
    var scene = req.body.scene;
    sceneDb.update({sceneId: scene.sceneId}, {'$set': scene}, function (err, numberAffected, raw) {
        if (err) {
            res.send({errorCode: -3, res: {message: '服务器内部错误'}});
            return;
        }
        res.send({errorCode: 0, res:''});
    });
});
//查询场景
router.post('/getSceneInfo', function (req, res, next) {
    var sceneId = req.body.sceneId;
    sceneDb.findOne({sceneId: sceneId}, null, function (err, scene) {
        if (err) {
            res.send({errorCode: -3, res: {message: '服务器内部错误'}});
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
    sceneDb.find({masterAppMacId: masterAppMacId}, null, function (err, scene) {
        if (err) {
            res.send({errorCode: -3, res: {message: '服务器内部错误'}});
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