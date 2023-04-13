const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
name:String,
email:{type:String,required:true},
pass:{type:String,required:true}, 
age:Number
})

const UserModel = mongoose.model('user',userSchema);

module.exports = UserModel;