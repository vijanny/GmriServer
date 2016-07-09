app.controller('loginCtrl', function($scope,httpService) {

    var domain = 'http://sever.gmri.com.cn:3000';

    $scope.login ={
        name:'',
        password:''
    };
    $scope.signUp ={
        name:'',
        password:'',
        rePassword:'',
        email:''
    };

    $scope.loginClick=function(){
        httpService.post(domain+'/managers/login',$scope.login,function(data){
            alert(data);
        },function(data){
            alert('error');
        })
    };
    $scope.signUpClick=function(){
        httpService.post(domain+'/managers/singUp',$scope.signUp,function(data){
            alert(data);
        },function(data){
            alert('error');
        })
    };
});
