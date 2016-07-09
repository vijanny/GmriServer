angular.module('app.controllers', ['httpModule'])
  
.controller('homeCtrl', function($scope) {

})
   
.controller('cartCtrl', function($scope) {

})
   
.controller('cloudCtrl', function($scope) {

})
      
.controller('loginCtrl', function($scope,$state,httpService) {

        $scope.login={name:'',password:''};

        $scope.testClick =function(){
            httpService.post('http://sever.gmri.com.cn/managers/login',
                $scope.login
                ,function(data){
                    alert(data);
                    console.log('re OK : '+data );
                    if(data=='登录成功'){
                        $state.go('menu.home');
                    }
                },function(data){
                    console.log('re error');
                });
        };
})
   
.controller('signupCtrl', function($scope,httpService) {

        $scope.signUp={name:'',password:''};
        $scope.signUpClick=function(){
        httpService.post('http://sever.gmri.com.cn/managers/singUp',
            $scope.signUp
            ,function(data){
                alert(data);
                console.log('re OK : '+data );
            },function(data){
                console.log('re error');
            });
        }
});
 