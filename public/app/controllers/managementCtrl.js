
angular.module('managementController',[])
.controller('managementCtrl',function(User){
var app=this;
app.loading=true;
app.accesDenied=true;
app.errorMsg=false;
app.editAccess=false;
app.deleteAccess=false;
app.limit=5;

function getUsers(){
    User.getUsers().then(function(data){
        console.log(data.data.permissions);
    if(data.data.success){
    
    if(data.data.permissions==='admin'||data.data.permissions==='moderator'){
    app.users=data.data.users;
    app.loading=false;
    app.accesDenied=false;
    
    if(data.data.permissions==='admin'){
        app.editAccess=true;
    app.deleteAccess=true;
    }else if(data.data.permissions==='moderator'){
        app.editAccess=true;
    
    }
    }else{
        app.errorMsg='insufficient permission';
        app.loading=false;
    }
    
    
    }else{
        app.errorMsg=data.data.message;
        app.loading=false;
    }
    
       });
    
}
getUsers();
app.showMore=function(number){
    app.showMoreError=false;
    if(number>0){
app.limit=number;
    }else{
        app.showMoreError='please entre valid number';
    }

};
app.showAll=function(){
    app.limit=undefined;
    app.showMoreError=false;
};

app.deleteUser=function(username){
User.deleteUser(username).then(function(data){
if(data.data.success){
getUsers();
}else{
    app.showMoreError=data.data.message;
}
}) ;
};
})
.controller('editCtrl',function($scope,$routeParams,User,$timeout){
var app=this;
$scope.emailTab='active';
app.phase1=true;

User.getUser($routeParams.id).then(function(data){
    console.log("dchsjdc");
    if(data.data.success){
      
    $scope.newEmail=data.data.user.email;
    $scope.newUsername=data.data.user.username;
    $scope.newPermission=data.data.user.permission;
    
    app.currentUser=data.data.user._id;
  //  app.currentPermission=data.data.user.permission;
    }else{
        console.log('errroor');
        app.errorMsg=data.data.message;
    }
    });
    app.emailPhase=function(){
        $scope.emailTab='active';
        $scope.usernameTab='default';
        $scope.permissionsTab='default';
        app.phase1=true;
        app.phase2=false;
        app.phase3=false;
        app.errorMsg=false;
    };

    app.usernamePhase=function(){
        $scope.emailTab='default';
        $scope.usernameTab='active';
        $scope.permissionsTab='default';
        app.phase1=false;
        app.phase2=true;
        app.phase3=false;
        app.errorMsg=false;
    };

   app.permissionsPhase=function(){
    $scope.emailTab='default';
    $scope.usernameTab='default';
    $scope.permissionsTab='active';
    app.phase1=false;
    app.phase2=false;
    app.phase3=true;
    app.errorMsg=false;
    app.disabledUser=false;
    app.disabledModerator=false;
    app.disabledAdmin=false;

    if($scope.newPermission==='user'){
        app.disabledUser=true;
    }else if($scope.newPermission==='moderator'){
        app.disabledModerator=true;
    }else if ($scope.newPermission==='admin'){
        app.disabledAdmin=true;
    }
   };

app.updateEmail=function(newEmail){
    app.errorMsg=false;
    app.disabled=true;
   var userObject={};
userObject._id=  app.currentUser;
userObject.email= $scope.newEmail;


User.editUser(userObject).then(function(data){
    if(data.data.success){
app.successMsg=data.data.message;
$timeout(function(){
    app.emailForm.email=$setPristine();
    app.emailForm.email=$setUntouched();
    app.successMsg=false;
    app.disabled=false;
},2000);
    }else{
        app.errorMsg=data.data.message;
        app.disabled=false;
    }
});};
app.updateUsername=function(newUsername){
    app.errorMsg=false;
    app.disabled=true;
   var userObject={};
userObject._id=  app.currentUser;
userObject.username= $scope.newUsername;

User.editUser(userObject).then(function(data){
    if(data.data.success){
app.successMsg=data.data.message;
$timeout(function(){
 
    app.usernameForm.username=$setPristine();
    app.usernameForm.username=$setUntouched();
    app.successMsg=false;
    app.disabled=false;
},2000);
    }else{
        app.errorMsg=data.data.message;
        app.disabled=false;
    }
});
};
app.updatePermission=function(newPermission){
    app.errorMsg=false;
    app.disabled=true;
   var userObject={};
   app.disabledUser=true;
   app.disabledModerator=true;
   app.disabledAdmin=true;
   console.log(newPermission);
userObject._id=  app.currentUser;
userObject.permission= newPermission;
console.log(newPermission);

User.editUser(userObject).then(function(data){
    console.log("sdfghjklkjhg");
    if(data.data.success){
app.successMsg=data.data.message;
console.log(data.data.message);
$timeout(function(){
    
    app.successMsg=false;
    if(newPermission==='user'){
        $scope.newPermission='user';
        app.disabledUser=true;
        app.disabledModerator=false;
        app.disabledAdmin=false;
    }else if(newPermission==='moderator'){
        $scope.newPermission='moderator';
        app.disabledModerator=true;
        app.disabledUser=false;
        app.disabledAdmin=false;
    }else if (newPermission==='admin'){
        $scope.newPermission='admin';
        app.disabledAdmin=true;
        app.disabledModerator=false;
        app.disabledUser=false;
    }
 
  
  
},2000);
    }else{
        app.errorMsg=data.data.message;
        app.disabled=false;
    }
});
};

});


