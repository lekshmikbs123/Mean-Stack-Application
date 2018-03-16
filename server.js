var express=require('express');
var app=express();
var port=process.env.PORT || 3030;
var morgan=require('morgan');
var mongoose=require('mongoose');
var path=require('path');
var bodyParser = require('body-parser');
var router=express.Router();
var appRoutes=require('./app/routes/api')(router);
app.use(morgan('dev'));

//Middleware Connectivity

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));  // for parsing application/json
  // for parsing application/x-www-form-urlencoded
  // for parsing application/json
  // for parsing application/x-www-form-urlencoded
app.use(express.static(__dirname+'/public'));
app.use('/api',appRoutes);
mongoose.connect('mongodb://localhost:27017/tablee',function(err){
   if(err)
   {
       console.log('Not connected to the db : '+err);
   
    }
    else
    {
    console.log('Connected to Mongodb');  
    } 
});


/*
app.get('/home',function(req,res){
    res.send('Hello World');
});

app.get('/',function(req,res){
    res.send('Hello World');
});*/

//http://localhost:8080/users

app.get('*',function(req,res){
res.sendFile(path.join(__dirname+'/public/app/views/index.html'));
});


app.listen(port,function(){
    console.log('Running  the server meannn'+port);
}); 
