const mongoose = require('mongoose');

const User = new mongoose.Schema({
    username:{type:String, required:true, unique: true},
    email:{type:String, required:true, unique:true},
    password:{type:String, required:true},
    isAdmin:{
        type: Boolean,  
        default:false
    },
    img: {type:String},
}, {timestamps:true} )

const UserModel = mongoose.model("users",User);
module.exports=UserModel