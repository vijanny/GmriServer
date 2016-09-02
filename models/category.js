/**
 * Created by vijanny on 2016/8/11.
 */
var base = require('./Base');
var ObjectId = base.ObjectId;
var categoryScheme =new base.Schema({
    controlPage:String,//内嵌的设备控制页连接
    icon:String,//图标
    categoryName:String,//类型名
    ver:Number,
    src:String,
    DeviceStream:[{
        stream_id:String,
        stream_name:String,
        short_name:String,
        images:String,
        type:Number,
        data_type:Number,
        max_value:Number,
        min_value:Number,
        increment:Number,
        unit:String,
        unit_symbol:String,
        manu_set:[{
            id:Number,
            key:String,
            value:Number,
            comparison_opt:String
        }]
    }]
});
categoryScheme.index({categoryName:1},{"background" : true});//设置索引
var categoryEntity = base.mongoose.model('categoryEntity',categoryScheme,'category');//指定在数据库中的collection名称为user
exports.categoryEntity  = categoryEntity;//导出UserEntity实体