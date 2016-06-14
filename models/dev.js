/**
 * Created by vijanny on 2016/6/14.
 */
var base = require('./Base');
var ObjectId = base.ObjectId;
var devScheme =new base.Schema({
    uuid:Number,
    lastLoginTime:Date,//最后登陆时间
    lastActionTime:{type:Date,default:Date.now},//最后活动时间
    createTime:{type:Date,default:Date.now},//创建时间
    masterAppId:[{type:ObjectId}]//智能设备列表
});
devScheme.index({uuid:1},{"background" : true});//设置索引
var devEntity = base.mongoose.model('devEntity',devScheme,'dev');//指定在数据库中的collection名称为user
exports.devEntity  = devEntity;//导出UserEntity实体