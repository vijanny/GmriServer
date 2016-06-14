/**
 * Created by vijanny on 2016/6/14.
 */
var base = require('./Base');
var ObjectId = base.ObjectId;
var MasterAppScheme =new base.Schema({
    userId:{type:ObjectId},
    lastLoginTime:Date,//最后登陆时间
    lastActionTime:{type:Date,default:Date.now},//最后活动时间
    createTime:{type:Date,default:Date.now},//创建时间
    devId:[{type:ObjectId}]//智能设备列表
});
var masterAppEntity = base.mongoose.model('masterAppEntity',MasterAppScheme,'masterApp');//指定在数据库中的collection名称为user
exports.masterAppEntity  = masterAppEntity;//导出UserEntity实体