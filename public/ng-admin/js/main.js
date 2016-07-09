/**
 * Created by vijanny on 2016/6/25.
 */
// declare a new module called 'myApp', and make it require the `ng-admin` module as a dependency
var myApp = angular.module('myApp', ['ng-admin']);

myApp.controller('username', ['$scope', '$window', function ($scope, $window,$http) {
    // used in header.html
    $scope.username = $.cookie('user');
    $scope.logout=function(){
        window.location.href = './logout';
    };
}]);
// declare a function to run when the module bootstraps (during the 'config' phase)
myApp.config(['NgAdminConfigurationProvider', function (nga) {
// create an admin application
    var admin = nga.application('Gmri MasterApp 后台管理系统')
        .baseApiUrl('http://sever.gmri.com.cn:3000/');
// more configuation here later
// ...
    var user = nga.entity('users');
// set the fields of the user entity list view
    user.listView().fields([
        nga.field('name'),
        nga.field('username'),
        nga.field('email')
    ]);
    // add the user entity to the admin application
    admin.addEntity(user);
    var post = nga.entity('posts');
    post.listView().fields([
        nga.field('id'),
        nga.field('title'),
        nga.field('userId','reference')
            .targetEntity(user)
            .targetField(nga.field('username'))
            .label('User')
    ]);
    post.showView().fields([
        nga.field('title'),
        nga.field('body', 'text'),
        nga.field('userId', 'reference')
            .targetEntity(user)
            .targetField(nga.field('username'))
            .label('User'),
        nga.field('comments', 'referenced_list')
            .targetEntity(nga.entity('comments'))
            .targetReferenceField('postId')
            .targetFields([
                nga.field('email'),
                nga.field('name')
            ])
            .sortField('id')
            .sortDir('DESC')
    ]);
    admin.addEntity(post);
    var headerStr ="<div class=\"navbar-header\">\n    <button type=\"button\" class=\"navbar-toggle\" ng-click=\"isCollapsed = !isCollapsed\">\n        <span class=\"icon-bar\"></span>\n        <span class=\"icon-bar\"></span>\n        <span class=\"icon-bar\"></span>\n    </button>\n    <a class=\"navbar-brand\" href=\"#\" ng-click=\"appController.displayHome()\">Gmri Master App 后台管理系统</a>\n</div>\n<ul class=\"nav navbar-top-links navbar-right hidden-xs\">\n    <li>\n            </li>\n    <li uib-dropdown>\n        <a uib-dropdown-toggle href=\"#\" aria-expanded=\"true\" ng-controller=\"username\">\n            <i class=\"fa fa-user fa-lg\"></i>&nbsp;{{ username }}&nbsp;<i class=\"fa fa-caret-down\"></i>\n        </a>\n        <ul class=\"dropdown-menu dropdown-user\" role=\"menu\">\n            <li><a   href=\"#\" ng-controller=\"username\" ng-click=\"logout()\"><i class=\"fa fa-sign-out fa-fw\"></i> Logout</a></li>\n        </ul>\n    </li>\n</ul>\n";
    admin.header(headerStr);
// attach the admin application to the DOM and execute it
    nga.configure(admin);
}]);