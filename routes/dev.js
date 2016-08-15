/**
 * Created by vijanny on 2016/6/14.
 */
var express = require('express');
var router = express.Router();
var devDb = require('../models/dev').devEntity;
var cateDb = require('../models/category').categoryEntity;
var masterAppDb = require('../models/masterApp').masterAppEntity;
var util = require('../util/util');
/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('you are in  dev patch');
});

//录入dev
router.post('/singUp', function (req, res, next) {

});
//用户登录
router.post('/login', function (req, res, next) {

});

//根据uuid 获取基本设备的基础信息
router.post('/getDevBaseInfo', function (req, res, next) {
    var uuid = req.body.uuid;
    devDb.find({uuid: uuid}, null, function (err, dev) {
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


//根据uuid 获取基本设备的基础信息
router.post('/getDevDetailInfo', function (req, res, next) {
    var uuid = req.body.uuid;
    devDb.findOne({uuid: uuid}, null, function (err, dev) {
        if (err) {
            res.send({errorCode: -3, res: {message: '服务器内部错误'}});
            return;
        }
        if (!dev) {
            res.send({errorCode: -1, res: {message: '没有设备关联'}});
            return;
        }
        cateDb.findOne({_id: dev.categoryId}, null, function (err, cate) {
            if (err) {
                res.send({errorCode: -3, res: {message: '服务器内部错误'}});
                return;
            }
            if (!cate) {
                res.send({errorCode: -2, res: {message: '该设备未关联品类'}});
                return;
            }
            res.send({errorCode: 0, res: {baseInfo: dev, detailInfo: cate}});
        });
    });
});

//鉴权
router.post('/checkIn', function (req, res, next) {
    var uuid = req.body.uuid;
    var check = req.body.check;
    var masterAppId = req.body.masterAppId;
    devDb.findOne({uuid: uuid}, null, function (err, dev) {
        if (err) {
            res.send({errorCode: -3, res: {message: '服务器内部错误'}});
            return;
        }
        if (!dev) {
            res.send({errorCode: -1, res: {message: '没有设备关联'}});
            return;
        }
        if (dev.check == check) {
            //鉴权成功后 masterApp 系统与设备绑定
            masterAppDb.findOne({masterAppMacId: masterAppId}, null, function (err, masterApp) {
                if (err) {
                    res.send({errorCode: -3, res: {message: '服务器内部错误'}});
                    return;
                }
                masterApp.devId.push(dev._id);
                masterAppDb.update({masterAppMacId: masterAppId}, {'$set': {'devId': masterApp.devId}}, function (err, numberAffected, raw) {
                    if (err) {
                        res.send({errorCode: -3, res: {message: '服务器内部错误'}});
                        return;
                    }
                    devDb.update({uuid: uuid}, {'$set': {'masterAppId': masterApp._id}}, function (err, numberAffected, raw) {
                        if (err) {
                            res.send({errorCode: -3, res: {message: '服务器内部错误'}});
                            return;
                        }
                        res.send({errorCode: 0, res: ""});

                    });
                });

            });
        } else {
            res.send({errorCode: -5, res: {message: '鉴权错误'}});
        }
    });
});


//绑定
router.post('/binding', function (req, res, next) {
    var uuid = req.body.uuid;
    var masterAppId = req.body.masterAppId;


    devDb.findOne({uuid: uuid}, null, function (err, dev) {
        if (err) {
            res.send({errorCode: -3, res: {message: '服务器内部错误'}});
            return;
        }
        if (!dev) {
            res.send({errorCode: -1, res: {message: '没有设备关联'}});
            return;
        }
        //鉴权成功后 masterApp 系统与设备绑定
        masterAppDb.findOne({masterAppMacId: masterAppId}, null, function (err, masterApp) {
            if (err) {
                res.send({errorCode: -3, res: {message: '服务器内部错误'}});
                return;
            }
            masterApp.devId.push(dev._id);
            masterAppDb.update({masterAppMacId: masterAppId}, {'$set': {'devId': masterApp.devId}}, function (err, numberAffected, raw) {
                if (err) {
                    res.send({errorCode: -3, res: {message: '服务器内部错误'}});
                    return;
                }
                devDb.update({uuid: uuid}, {'$set': {'masterAppId': masterApp._id}}, function (err, numberAffected, raw) {
                    if (err) {
                        res.send({errorCode: -3, res: {message: '服务器内部错误'}});
                        return;
                    }
                    res.send({errorCode: 0, res: ""});

                });
            });
        });
    });

});

//解绑
router.post('/unBinding', function (req, res, next) {
    var uuid = req.body.uuid;
    var masterAppId = req.body.masterAppId;


    devDb.findOne({uuid: uuid}, null, function (err, dev) {
        if (err) {
            res.send({errorCode: -3, res: {message: '服务器内部错误'}});
            return;
        }
        if (!dev) {
            res.send({errorCode: -1, res: {message: '没有设备关联'}});
            return;
        }
        masterAppDb.findOne({masterAppMacId: masterAppId}, null, function (err, masterApp) {
            if (err) {
                res.send({errorCode: -3, res: {message: '服务器内部错误'}});
                return;
            }
            masterApp.devId.remove(dev._id);
            masterAppDb.update({masterAppMacId: masterAppId}, {'$set': {'devId': masterApp.devId}}, function (err, numberAffected, raw) {
                if (err) {
                    res.send({errorCode: -3, res: {message: '服务器内部错误'}});
                    return;
                }
                devDb.update({uuid: uuid}, {'$set': {'masterAppId': ''}}, function (err, numberAffected, raw) {
                    if (err) {
                        res.send({errorCode: -3, res: {message: '服务器内部错误'}});
                        return;
                    }
                    res.send({errorCode: 0, res: ""});

                });
            });
        });
    });

});


//重命名
router.post('/reName', function (req, res, next) {
    var uuid = req.body.uuid;
    var devName = req.body.devName;
    devDb.update({uuid: uuid}, {'$set': {'devName': devName}}, function (err, numberAffected, raw) {
        if (err) {
            res.send({errorCode: -3, res: {message: '服务器内部错误'}});
            return;
        }
        res.send({errorCode: 0, res: ""});
    });
});

module.exports = router;