angular.module('userServices',[])

.factory('User',function($http){
userFactory={};
 
userFactory.create=function(regData){
  return $http.post('/api/users/',regData);
}
userFactory.getPermission=function()
{
return $http.get('/api/permission');
};
userFactory.getUsers=function(){
return $http.get('/api/management');
};

userFactory.deleteUser=function(username){
  return $http.delete('/api/management/'+username);
  };
  userFactory.getUser=function(id){
    return $http.get('/api/edit/'+id);
  };
  userFactory.editUser=function(id){
    return $http.put('/api/edit',id);
  };

  return userFactory;
});
