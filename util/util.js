/**
 * Created by vijanny on 2016/7/8.
 */
var checkInput = function (str) {
    var pattern = /^[\w\u4e00-\u9fa5]+$/gi;
    return pattern.test(str);
};

exports.checkInput = checkInput;