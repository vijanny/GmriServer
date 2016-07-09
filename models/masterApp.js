/**
 * Created by vijanny on 2016/6/14.
 */
var base = require('./Base');
var ObjectId = base.ObjectId;
var MasterAppScheme =new base.Schema({
    userId:{type:ObjectId,ref: 'user'},
    location:{type:String,default:''},//位置
    name:{type:String,default:''},
    lastActionTime:{type:Date,default:Date.now},//最后活动时间
    createTime:{type:Date,default:Date.now},//创建时间
    masterAppMacId:{type:String},//唯一码
    devId:[{type:ObjectId,ref: 'dev'}]//智能设备列表ID
});
var masterAppEntity = base.mongoose.model('masterAppEntity',MasterAppScheme,'masterApp');//指定在数据库中的collection名称为
exports.masterAppEntity  = masterAppEntity;//导出UserEntity实体