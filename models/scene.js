/**
 * Created by vijanny on 2016/8/10.
 */
var base = require('./Base');
var ObjectId = base.ObjectId;
var sceneScheme = new base.Schema({
    masterAppMacId: String,
    sceneId: Number,
    name: String,
    sceneStatus: Number,
    sceneOrAnd: Number,
    conditions: [{
        id: Number,
        deviceId: Number,
        deviceName: String,
        position: Number,
        key: String,
        value: Number
    }],
    tasks: [{
        id: Number,
        deviceId: Number,
        deviceName: String,
        Position: Number,
        key: String,
        value: Number,
        images: String
    }]
});
sceneScheme.index({sceneId: 1}, {"background": true});//设置索引
var sceneEntity = base.mongoose.model('sceneEntity', sceneScheme, 'scene');//指定在数据库中的collection名称为user
exports.sceneEntity = sceneEntity;//导出UserEntity实体