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
    console.log('uuid = ' + uuid);
    if (typeof(uuid) == "undefined") {
        res.send({errorCode: -4, res: {message: '非法的UUID字符串'}});
        return;
    }
    devDb.findOne({uuid: uuid}, null, function (err, dev) {
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
    if (typeof(uuid) == "undefined") {
        res.send({errorCode: -4, res: {message: '非法的UUID字符串'}});
        return;
    }
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

    if (typeof(uuid) == "undefined" || typeof(masterAppId) == "undefined") {
        res.send({errorCode: -4, res: {message: '非法的uuid或masterAppId'}});
        return;
    }
    devDb.findOne({uuid: uuid}, null, function (err, dev) {
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

            masterApp.devId.push(dev._id);

            console.log('masterapp Push after: ' + masterApp);
            masterAppDb.update({masterAppMacId: masterAppId}, {'$set': {'devId': masterApp.devId}}, function (err, numberAffected, raw) {
                if (err) {
                    res.send({errorCode: -3, res: {message: '服务器内部错误'}});
                    return;
                }
                console.log('masterapp in mongodb: ' + numberAffected);
                devDb.update({uuid: uuid}, {'$set': {'masterAppId': masterApp._id}}, function (err, numberAffected, raw) {
                    if (err) {
                        res.send({errorCode: -3, res: {message: '服务器内部错误'}});
                        return;
                    }
                    console.log('devDb in mongodb: ' + numberAffected);
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

    if (typeof(uuid) == "undefined" || typeof(masterAppId) == "undefined") {
        res.send({errorCode: -4, res: {message: '非法的uuid或masterAppId'}});
        return;
    }
    devDb.findOne({uuid: uuid}, null, function (err, dev) {
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
                devDb.update({uuid: uuid}, {'$unset': {'masterAppId': 0}}, function (err, numberAffected, raw) {
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
    var devName = req.body.devName;
    if (typeof(uuid) == "undefined" || typeof(devName) == "undefined") {
        res.send({errorCode: -4, res: {message: '非法的UUID字符串或命名'}});
        return;
    }
    devDb.update({uuid: uuid}, {'$set': {'devName': devName}}, function (err, numberAffected, raw) {
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
    devDb.update({uuid: uuid}, {'$set': baseInf}, function (err, numberAffected, raw) {
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