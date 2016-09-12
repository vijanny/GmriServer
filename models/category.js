/**
 * Created by vijanny on 2016/8/11.
 */
var base = require('./Base');
var ObjectId = base.ObjectId;

var categoryScheme =new base.Schema({
    controlPage:String,//内嵌的设备控制页连接
    icon:String,//图标
    categoryName:String,//类型名
    ver:String,
    src:String,
    DeviceStream:[{
        stream_id:{type:String},
        stream_name:{type:String},
        short_name:{type:String},
        images:{type:String},
        type:{type:Number},
        data_type:{type:Number},
        max_value:{type:Number},
        min_value:{type:Number},
        increment:{type:Number},
        unit:{type:String},
        unit_symbol:{type:String},
        manu_set:[{
            id:{type:Number},
            key:{type:String},
            value:{type:Number},
            comparison_opt:{type:String}
        }]
    }]
});
categoryScheme.index({categoryName:1},{"background" : true});//设置索引
var categoryEntity = base.mongoose.model('categoryEntity',categoryScheme,'category');//指定在数据库中的collection名称为user
exports.categoryEntity  = categoryEntity;//导出UserEntity实体