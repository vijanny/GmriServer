/**
 * Created by vijanny on 2016/6/14.
 */
var base = require('./Base');
var ObjectId = base.ObjectId;
var devScheme = new base.Schema({
    uuid: String,
    deviceId:String,
    check:String,//用于鉴权
    devName:{type:String},//设备名称
    categoryId:ObjectId,//类型关联
    categoryName:String,
    createTime: {type: Date, default: Date.now},//创建时间
    masterAppId: {type: ObjectId, ref: 'masterApp'}//masterAppId
});
devScheme.index({uuid: 1}, {"background": true});//设置索引
var devEntity = base.mongoose.model('devEntity', devScheme, 'dev');//指定在数据库中的collection名称为user
exports.devEntity = devEntity;//导出UserEntity实体