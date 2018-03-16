
var User = require('../models/user');

var jwt = require('jsonwebtoken');
var secret='Harrypotter';

module.exports=function(router){
    router.post('/users',function(req,res){
    //USER REGISTRATION
    var user=new User();
    user.username=req.body.username;
    user.password= req.body.password;
    user.email =req.body.email;
 
    if(req.body.username==null||req.body.username==''||req.body.password==null||req.body.password==''||req.body.email==null||req.body.email==''){
     res.json({success:false,message:"Ensure Username,password,email were provided"});
    }else{
        user.save(function(err){
            if(err){
                res.json({success:false,message:"Username or email already exists"});
                 
            }else{
        res.json({success:true,message:"user Created"});
              
            }
        });  
    }
    
    });

//USER LOGIN

router.post('/authenticate',function(req,res){
 
User.findOne({
    username:req.body.username}).select('email username password').exec(function(err,user){
if(err) throw err;
if(!user){
    res.json({success:false,message:"User doesn't exist"});
}else if(user){

    if(req.body.password)
 {var validPassword=  user.comparePassword(req.body.password);}else{
     res.json({success:false,message:"No password provided"});
 }
 if(!validPassword){
    res.json({success:false,message:"Incorrect Password"});
 }else{
   var token=   jwt.sign({
         username:user.username,
         email:user.email},
         secret,
         { expiresIn: '24h' }
     );
    res.json({success:true,message:"correct Password",token:token});
 }
}
    });
})

router.use(function(req,res,next){
  var token=  req.body.token||req.body.query||req.headers['x-access-token'];
if(token){
    //verify token
jwt.verify(token,secret,function(err,decoded){
    if(err){
        res.json({success:false,message:"token invalid"});
    }else{
        req.decoded=decoded;
        next();
    }
})

}else{
    res.json({success:false,message:'no token provided'});
}



});

router.post('/me',function(req,res){
    res.send(req.decoded);
});
router.get('/permission',function(req,res){
    User.findOne({username:req.decoded.username},function(err,user){
if(err) throw error;
if(!user){
    res.json({success:false,message:'No user was found'});
}else{
    res.json({success:true,permission:user.permission});
}
    });
});

router.get('/management',function(req,res){
User.find({},function(err,users){
    if(err) throw err;
    User.findOne({username:req.decoded.username},function(err,mainUser){
if(err) throw err;
if(!mainUser){
    res.json({success:false,message:'No user found'});
}else{
     if(mainUser.permission==='admin'||mainUser.permission==='moderator'){

    if(!users){
        res.json({success:false,message:'user not found'}); 
    }else{
        res.json({success:true,users:users,permissions:mainUser.permission}); 
    }


    }else{
        res.json({success:false,message:'insufficient permissions'});
    }

}



    });
});
});

router.delete('/management/:username',function(req,res){
var deletedUser=req.params.username;
User.findOne({username:req.decoded.username},function(err,mainUser){
    if(err) throw err;
    //console.log(mainUser);
    if(!mainUser){
        res.json({success:false,message:'No user found'});
    }else{
        if(mainUser.permission!=='admin')
        {
            res.json({success:false,message:'insufficient permissions'});
        }else{
            User.findOneAndRemove({username:deletedUser},function(err,user){
           if(err) throw err;
        res.json({success:true});
            });
        }
    }
});

});
router.get('/edit/:id',function(req,res){
var editUser=req.params.id;

User.findOne({username:req.decoded.username},function(err,mainUser){
    if(err) throw err;
    //console.log(mainUser);
    if(!mainUser){
        res.json({success:false,message:'No user found'});
    }else{

        if(mainUser.permission==='admin'||mainUser.permission==='moderator')
        {
           User.findOne({_id:editUser},function(err,user){
            if(err) throw err;
            if(!user){
                res.json({success:false,message:'No user found'});
            }else{
                console.log("dfcbkm");
                res.json({success:true,user:user});
            }
           });
        }else{
           
        res.json({success:false,message:'insufficient permissions'});
            
        }




    }
    });
});

router.put('/edit',function(req,res){
var editUser=req.body._id;
if(req.body.username) var newUsername=req.body.username;
if(req.body.email) var newEmail=req.body.email;
if(req.body.permission) var newPermission=req.body.permission;
User.findOne({username:req.decoded.username},function(err,mainUser){
    if(err) throw err;
    //console.log(mainUser);
    if(!mainUser){
        res.json({success:false,message:'No user found'});
    }else{

if(newEmail){
    if(mainUser.permission==='admin'||mainUser.permission==='moderator'){
User.findOne({_id:editUser},function(err,user){
    if(err) throw err;
    if(!user){
        res.json({success:false,message:'No user found'});
    }else{
        user.email=newEmail;
        user.save(function(err){
if(err){
    console.log(err);
}else{
    res.json({success:true,message:'email has been updated'});
}
        });
    }
});
    }else{
        res.json({success:false,message:'insufficient permissions'});
    }
}


if(newUsername){
    if(mainUser.permission==='admin'||mainUser.permission==='moderator'){
User.findOne({_id:editUser},function(err,user){
    if(err) throw err;
    if(!user){
        res.json({success:false,message:'No user found'});
    }else{
        user.username=newUsername;
        user.save(function(err){
if(err){
    console.log(err);
}else{
    res.json({success:true,message:'username has been updated'});
}
        });
    }
});
    }else{
        res.json({success:false,message:'insufficient permissions'});
    }
}

if(newPermission){
    console.log('llllllllll');
    if(mainUser.permission==='admin'||mainUser.permission==='moderator'){
        console.log('llllllllll');
User.findOne({_id:editUser},function(err,user){
    if(err) throw err;
    if(!user){
        res.json({success:false,message:'No user found'});
    }else{
       if(newPermission==='user'){
           if(user.permission==='admin'){
               if(mainUser.permission!=='admin'){
                res.json({success:false,message:'insufficient permissions to hhh' });
               }else{
                   user.permission=newPermission;
                   user.save(function(err){
if(err){ console.log(err);}
else{
    res.json({success:true,message:'permission updated'});
}
                   });
               }
           }else{
            user.permission=newPermission;
            user.save(function(err){
if(err){ console.log(err);}
else{
res.json({success:true,message:'permission updated'});
}
            });  
           }
       }
       if(newPermission==='moderator'){
if(user.permission='admin'){
    if(mainUser.permission!=='admin'){
        res.json({success:false,message:'insufficient permissions to hhh' });
    }else{
        user.permission=newPermission;
            user.save(function(err){
if(err){ console.log(err);}
else{
res.json({success:true,message:'permission updated'});
}
            }); 
    }
}else{
    user.permission=newPermission;
            user.save(function(err){
if(err){ console.log(err);}
else{
res.json({success:true,message:'permission updated'});
}
            }); 
}
       }
    }
    if(newPermission==='admin'){
if(mainUser.permission==='admin'){
    user.permission=newPermission;
    user.save(function(err){
if(err){ console.log(err);}
else{
res.json({success:true,message:'permission updated'});
}
    }); 
}else{
    res.json({success:false,message:'insufficient permissions'});
}
    }
});
    }else{
        res.json({success:false,message:'insufficient permissions'});
    }
}







    }
});

});


    return router;
}


