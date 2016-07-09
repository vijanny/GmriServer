/**
 * Created by vijanny on 2016/6/14.
 */
var base = require('./Base');
var ObjectId = base.ObjectId;
var devScheme = new base.Schema({
    uuid: Number,
    devName:{type:String},//设备名称
    createTime: {type: Date, default: Date.now},//创建时间
    masterAppId: {type: ObjectId, ref: 'masterApp'},//masterAppId
    devType: {type: String},//设备类别 0反馈，1执行
    rang: //能力值范围
[{min: Number,//最大值
        max: Number,//最小值
        step: Number},
    {min: Number,//最大值
    max: Number,//最小值
    step: Number}]//步进

});
devScheme.index({uuid: 1}, {"background": true});//设置索引
var devEntity = base.mongoose.model('devEntity', devScheme, 'dev');//指定在数据库中的collection名称为user
exports.devEntity = devEntity;//导出UserEntity实体