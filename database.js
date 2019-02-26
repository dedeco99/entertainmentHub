var mongoose = require("mongoose");

exports.setup = function(){
  mongoose.Promise = global.Promise;
  mongoose.connect(process.env.databaseLogin,function(err){
    if(err) console.log(err);
    console.log("Connected to database");
  });

  var userSchema=new mongoose.Schema({
    username:String,
    password:String,
    created:{type:Date,default:Date.now}
  });

  exports.User=mongoose.model("user",userSchema);

  var authSchema=new mongoose.Schema({
    username:String,
    platform:String,
    acessToken:String,
    refreshToken:String,
    created:{type:Date,default:Date.now}
  });

  exports.Auth=mongoose.model("auth",authSchema);

  var userImdbSeriesSchema=new mongoose.Schema({
    username:String,
    series:String,
    id:String,
    created:{type:Date,default:Date.now}
  });

  exports.UserImdbSeries=mongoose.model("userImdbSeries",userImdbSeriesSchema);
}
