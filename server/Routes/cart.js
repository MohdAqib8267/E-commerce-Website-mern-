
const { verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin}= require('./verifyToken');
const express = require('express');
const CartModel = require('../models/Cart');
const router=express.Router();

//CREATE
router.post("/",verifyToken,async(req,res)=>{
    const newCart = new CartModel(req.body);
    try {
        const saveCart = await newCart.save();
        res.status(200).json(saveCart);
    } catch (error) {
        res.status(500).json(error);
    }
})

//UPDATE
router.put("/:id",verifyTokenAndAuthorization,async(req,res)=>{
    try {
        const updateCart = await CartModel.findByIdAndUpdate(req.body.id,{
            $set: req.params.id
        },{new:true});
        res.status(200).send(updateCart);
    } catch (error) {
        res.status(500).json(error);
    }
})

//DELETE
router.delete("/:id",verifyTokenAndAuthorization,async(req,res)=>{
    try {
        await CartModel.findByIdAndDelete(req.params.id);
        res.status(200).json("Cart Deleted SuccessFully!")
        
    } catch (error) {
        res.status(500).json(error);
    }
})

//GET USER CART
router.get("/find/:userId",verifyTokenAndAuthorization,async(req,res)=>{
    try {
        const UserCart = await CartModel.findOne({userId:req.params.userId});
        res.status(200).send(UserCart);
    } catch (error) {
        res.status(500).json(error);
    }
})

//GET ALL CART(all users cart)
router.get("/",verifyTokenAndAdmin,async(req,res)=>{
    try {
        const carts = await CartModel.find();
        res.status(200).send(carts);
    } catch (error) {
        res.status(500).json(error);
    }
})

module.exports=router;