
angular.module('userControllers',['userServices'])
.controller('regCtrl',function($http,$location,$timeout,User){

var app=this;

this.regUser=function(regData){
    app.loading=true;
    app.errorMsg=false;
    User.create(app.regData).then(function(data){

if(data.data.success){
    //create success message
    app.loading=false;
app.successMsg=data.data.message+' .........Redirecting.......';
$timeout(function(){
    $location.path('/');
},2000);//2000 ms
    //redirect to home page

}else{
    app.loading=false;
    app.errorMsg=data.data.message;
    //create  error message
}


    });
    // console.log('here');
    };
});
