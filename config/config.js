/**
 * Created by vijanny on 2016/6/14.
 */
var mongoose = require('mongoose');//����mongoose��
mongoose.connect('mongodb://192.168.1.159:27017/test');//mongodb���ӵ�ַ,demoΪ���ݿ�����,Ĭ��mongodb���Ӳ���Ҫ����
exports.mongoose = mongoose;//����mongoose����



//������Ҫ��½��֤�ķ���·��
exports.needLoginUrlRegs = [
    /^(\/)+app(\/)+status(\/)+compose_status/,
];