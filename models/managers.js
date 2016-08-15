/**
 * Created by vijanny on 2016/6/14.
 */
var base = require('./Base');
var ObjectId = base.ObjectId;
var managersScheme =new base.Schema({
    password:String,//密码
    nickname:String,//昵称
    mobile:String,//手机(登陆用户名)
    sex:{type:String,default:0},//0:女 1:男
    lastLoginTime:Date,//最后登陆时间
    lastActionTime:{type:Date,default:Date.now},//最后活动时间
    createTime:{type:Date,default:Date.now}//创建时间
});
managersScheme.index({nickname:1},{"background" : true});//设置索引
var managersEntity = base.mongoose.model('managersEntity',managersScheme,'managers');//指定在数据库中的collection名称为user

exports.managersEntity  = managersEntity;//导出UserEntity实体