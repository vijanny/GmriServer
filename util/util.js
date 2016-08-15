/**
 * Created by vijanny on 2016/7/8.
 */
var checkInput = function (str) {
    var pattern = /^[\w\u4e00-\u9fa5]+$/gi;
    return pattern.test(str);
};


//扩展数组内置函数
Array.prototype.indexOf = function(val) { for (var i = 0; i < this.length; i++) { if (this[i] == val) return i; } return -1; };
Array.prototype.remove = function(val) { var index = this.indexOf(val); if (index > -1) { this.splice(index, 1); } };

exports.checkInput = checkInput;