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
    var deviceId = req.body.deviceId;
    console.log('uuid = ' + uuid);
    console.log('deviceId = ' + deviceId);
    if (typeof(uuid) == "undefined" || typeof(deviceId) == "undefined") {
        res.send({errorCode: -4, res: {message: '非法的UUID或deviceId字符串'}});
        return;
    }

    var condition = {};


    if (deviceId != '') {
        condition = {'deviceId': deviceId}
    }
    else if (uuid != '') {
        condition = {'uuid': uuid}
    }

    devDb.findOne(condition, null, function (err, dev) {
        console.log('dev : ' + dev);
        if (err) {
            res.send({errorCode: -3, res: {message: '服务器内部错误'}});
            return;
        }
        if (!dev) {
            res.send({errorCode: -1, res: {message: '非法的UUID'}});
            return;
        }
        res.send({errorCode: 0, res: dev});
    });


});


//根据uuid 获取基本设备的基础信息
router.post('/getDevDetailInfo', function (req, res, next) {
    var uuid = req.body.uuid;
    var deviceId = req.body.deviceId;
    if (typeof(uuid) == "undefined" || typeof(deviceId) == "undefined") {
        res.send({errorCode: -4, res: {message: '非法的UUID或deviceId字符串'}});
        return;
    }
    console.log('uuid = ' + uuid);
    console.log('deviceId = ' + deviceId);

    var condition = {};


    if (deviceId != '') {
        condition = {'deviceId': deviceId}
    }
    else if (uuid != '') {
        condition = {'uuid': uuid}
    }

    var findCategory = function (dev) {
        cateDb.findOne({categoryName: dev.categoryName}, null, function (err, cate) {
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
    };
    devDb.findOne(condition, null, function (err, dev) {
        if (err) {
            res.send({errorCode: -3, res: {message: '服务器内部错误'}});
            return;
        }
        if (!dev) {
            res.send({errorCode: -1, res: {message: '没有设备关联'}});
            return;
        }
        findCategory(dev);
    });


});

//鉴权
router.post('/checkIn', function (req, res, next) {
    var uuid = req.body.uuid;
    var check = req.body.check;
    var deviceId = req.body.deviceId;
    var masterAppId = req.body.masterAppId;
    var condition = {};


    if (deviceId != '') {
        condition = {'deviceId': deviceId}
    }
    else if (uuid != '') {
        condition = {'uuid': uuid}
    }

    devDb.findOne(condition, null, function (err, dev) {
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
                    devDb.update(condition, {'$set': {'masterAppId': masterApp._id}}, function (err, numberAffected, raw) {
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
    var deviceId = '';
    var masterAppId = req.body.masterAppId;

    if (typeof(uuid) == "undefined" || typeof(masterAppId) == "undefined" || typeof(deviceId) == "undefined") {
        res.send({errorCode: -4, res: {message: '非法的uuid或masterAppId'}});
        return;
    }
    console.log('uuid = ' + uuid);
    console.log('from deviceId = ' + deviceId);
    console.log('from masterAppId =' + masterAppId);

    var condition = {};


    if (deviceId != '') {
        condition = {'deviceId': deviceId}
    }
    else if (uuid != '') {
        condition = {'uuid': uuid}
    }
    devDb.findOne(condition, null, function (err, dev) {
        if (err) {
            res.send({errorCode: -3, res: {message: '服务器内部错误'}});
            return;
        }
        if (!dev) {
            res.send({errorCode: -1, res: {message: '没有设备关联'}});
            return;
        }
        console.log("in binding");
        console.log("dev : " + dev);
        //鉴权成功后 masterApp 系统与设备绑定
        masterAppDb.findOne({masterAppMacId: masterAppId}, null, function (err, masterApp) {
            if (err) {
                res.send({errorCode: -3, res: {message: '服务器内部错误'}});
                return;
            }
            if (!masterApp) {
                res.send({errorCode: -1, res: {message: '没有对应的masterApp'}});
                return;
            }
            console.log('masterapp Push bef: ' + masterApp);
            if (masterApp.devId.length > 0) {
                for (var i = 0; i < masterApp.devId.length; i++) {
                    if (masterApp.devId[i] === dev._id) {
                        break;
                    }
                }
                if (i >= masterApp.devId.length) {
                    cateDb.findOne({categoryName: dev.categoryName}, null, function (err, cate) {
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
                    return;
                }
            }
            masterApp.devId.push(dev._id);

            console.log('masterapp Push after: ' + masterApp);
            masterAppDb.update({masterAppMacId: masterAppId}, {'$set': {'devId': masterApp.devId}}, function (err, numberAffected, raw) {
                if (err) {
                    res.send({errorCode: -3, res: {message: '服务器内部错误'}});
                    return;
                }
                console.log('masterapp in mongodb: ' + numberAffected);
                devDb.update(condition, {'$set': {'masterAppId': masterApp._id}}, function (err, numberAffected, raw) {
                    if (err) {
                        res.send({errorCode: -3, res: {message: '服务器内部错误'}});
                        return;
                    }
                    console.log('devDb in mongodb: ' + numberAffected);

                    cateDb.findOne({categoryName: dev.categoryName}, null, function (err, cate) {
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
        });
    });

});

//解绑
router.post('/unBinding', function (req, res, next) {
    var uuid = req.body.uuid;
    var deviceId = '';
    var masterAppId = req.body.masterAppId;

    if (typeof(uuid) == "undefined" || typeof(masterAppId) == "undefined") {
        res.send({errorCode: -4, res: {message: '非法的uuid或masterAppId'}});
        return;
    }
    var condition = {};


    if (deviceId != '') {
        condition = {'deviceId': deviceId}
    }
    else if (uuid != '') {
        condition = {'uuid': uuid}
    }

    console.log('uuid = ' + uuid);
    console.log('deviceId = ' + deviceId);
    console.log('masterAppId = ' + masterAppId);
    console.log('condition = ' + condition);
    devDb.findOne(condition, null, function (err, dev) {
        if (err) {
            console.log(err);
            res.send({errorCode: -3, res: {message: 'devDb findOne 服务器内部错误'}});
            return;
        }
        if (!dev) {
            res.send({errorCode: -1, res: {message: '没有设备关联'}});
            return;
        }
        masterAppDb.findOne({masterAppMacId: masterAppId}, null, function (err, masterApp) {
            if (err) {
                console.log(err);
                res.send({errorCode: -3, res: {message: '服务器内部错误'}});
                return;
            }
            if (!masterApp) {
                res.send({errorCode: -1, res: {message: '没有对应的masterApp'}});
                return;
            }
            masterApp.devId.remove(dev._id);
            console.log(masterApp);
            masterAppDb.update({masterAppMacId: masterAppId}, {'$set': {'devId': masterApp.devId}}, function (err, numberAffected, raw) {
                if (err) {
                    console.log(err);
                    res.send({errorCode: -3, res: {message: '服务器内部错误'}});
                    return;
                }
                devDb.update(condition, {'$unset': {'masterAppId': 0}}, function (err, numberAffected, raw) {
                    if (err) {
                        console.log(err);
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
    var deviceId = '';
    var devName = req.body.devName;
    console.log("uuid = " + uuid);
    console.log('devName = ' + devName);
    console.log('deviceId = ' + deviceId);
    if (typeof(deviceId) == "undefined" || typeof(devName) == "undefined" || typeof(uuid) == "undefined") {
        res.send({errorCode: -4, res: {message: '非法的UUID字符串或命名'}});
        return;
    }

    var condition = {};


    if (deviceId != '') {
        condition = {'deviceId': deviceId}
    }
    else if (uuid != '') {
        condition = {'uuid': uuid}
    }

    console.log('uuid = ' + uuid);
    console.log('deviceId = ' + deviceId);
    console.log('devName = ' + devName);
    console.log('condition = ' + condition);
    devDb.update(condition, {'$set': {'devName': devName}}, function (err, numberAffected, raw) {
        if (err) {
            res.send({errorCode: -3, res: {message: '服务器内部错误'}});
            return;
        }
        res.send({errorCode: 0, res: ""});
    });
});

//创建DEV
router.post('/createDev', function (req, res, next) {
    var devBaseInf = req.body.devBaseInf;
    if (typeof(devBaseInf) == "undefined") {
        res.send({errorCode: -4, res: {message: 'devBaseInf undefined'}});
        return;
    }
    cateDb.findOne({categoryName: devBaseInf.categoryName}, '_id', function (err, cate) {
        if (err) {
            res.send({errorCode: -3, res: {message: '服务器内部错误'}});
            return;
        }
        if (!cate) {
            res.send({errorCode: -1, res: {message: '没有设备类关联'}});
            return;
        }
        devBaseInf.categoryId = cate._id;
        var createDev = new devDb(devBaseInf);
        createDev.save(function (err, row) {
            if (err) {//服务器保存异常
                res.send({errorCode: -3, res: {message: '服务器内部错误'}});
                return;
            }
            res.send({errorCode: 0, res: row});

        });
    });
});
//更新Dev基础数据
router.post('/updateBaseInf', function (req, res, next) {
    var uuid = req.body.uuid;
    var baseInf = req.body.baseInf;
    if (typeof(uuid) == "undefined" || typeof(baseInf) == "undefined") {
        res.send({errorCode: -4, res: {message: '非法的UUID字符串或baseInf没定义'}});
        return;
    }
    var condition = {};


    condition = {'uuid': uuid};
    console.log('condition = ' + JSON.stringify(condition));

    devDb.update(condition, {'$set': baseInf}, function (err, numberAffected, raw) {
        if (err) {
            res.send({errorCode: -3, res: {message: '服务器内部错误'}});
            return;
        }
        res.send({errorCode: 0, res: raw});
    });
});
//创建设备类
router.post('/createCategory', function (req, res, next) {
    var category = req.body.category;
    if (typeof(category) == "undefined") {
        res.send({errorCode: -4, res: {message: 'category undefined'}});
        return;
    }
    var createCategory = new cateDb(category);
    createCategory.save(function (err, row) {
        if (err) {//服务器保存异常
            res.send({errorCode: -3, res: {message: '服务器内部错误'}});
            return;
        }
        res.send({errorCode: 0, res: row});
    });
});

//更新设备类数据
router.post('/updateCategoryInf', function (req, res, next) {
    var categoryName = req.body.categoryName;
    var categoryInf = req.body.categoryInf;
    if (typeof(categoryName) == "undefined" || typeof(categoryInf) == "undefined") {
        res.send({errorCode: -4, res: {message: '非法的categoryName或categoryInf没定义'}});
        return;
    }
    cateDb.update({categoryName: categoryName}, {'$set': categoryInf}, function (err, numberAffected, raw) {
        if (err) {
            res.send({errorCode: -3, res: {message: '服务器内部错误'}});
            return;
        }
        res.send({errorCode: 0, res: raw});
    });
});
module.exports = router;