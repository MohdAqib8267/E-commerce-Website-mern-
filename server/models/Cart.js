const mongoose = require('mongoose');

const Cart = new mongoose.Schema({
    userId:{type:String, required:true},
    products:[
        {
            productId:{type:String},
            quantity:{type:Number, default:1}
        },
    ],
},{timestamps:true})

const CartModel = mongoose.model("carts",Cart);
module.exports=CartModel