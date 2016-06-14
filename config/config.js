/**
 * Created by vijanny on 2016/6/14.
 */
var mongoose = require('mongoose');//引入mongoose库
mongoose.connect('mongodb://192.168.1.159:27017/test');//mongodb连接地址,demo为数据库名称,默认mongodb连接不需要密码
exports.mongoose = mongoose;//导出mongoose对象



//配置需要登陆认证的访问路径
exports.needLoginUrlRegs = [
    /^(\/)+app(\/)+status(\/)+compose_status/,
];
