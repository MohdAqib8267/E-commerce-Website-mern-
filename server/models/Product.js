const mongoose = require('mongoose');

const Product = new mongoose.Schema({
    title:{type:String, required:true, unique:true},
    desc:{type:String, required:true},
    img:{type:String, required:true},
    category:{type:Array},
    size:{type:String,required:true},
    color:{type:String,required:true},
    price:{type:Number, required:true}
},{timestamps:true})
const ProductModel = mongoose.model("products",Product);
module.exports=ProductModel