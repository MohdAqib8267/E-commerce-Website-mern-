const productModel = require('../models/Product');
const express = require('express');
const router=express.Router();
const { verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin}= require('./verifyToken');

//Create
router.post('/',verifyTokenAndAdmin, async(req,res)=>{
    const newProduct = new productModel(req.body);
    try {
        const saveProduct = await newProduct.save();
        res.status(200).send(saveProduct);
    } catch (error) {
        res.status(500).json(error)
    }
})

//Update
router.put("/:id",verifyTokenAndAdmin,async(req,res)=>{
    try{
        const updateProduct = await productModel.findByIdAndUpdate(
            req.params.id,{
            $set:req.body
        }, {new:true});
        res.status(200).send(updateProduct);
    }catch(error){
        res.status(500).json(error);
    }
})

//Delete
router.delete("/:id",verifyTokenAndAdmin,async(req,res)=>{
    try{
     await productModel.findByIdAndDelete(req.params.id);
        res.status(200).json("Product has been deleted sucessfully!")
    }
    catch(error){
        res.status(500).json(error);
    }
})

//Get Products
router.get("/:id/find",async(req,res)=>{
    try {
        const product = await productModel.findById(req.params.id);
        res.status(200).send(product);
    } catch (error) {
        res.status(500).json(error);
    }
})

//Get All Products
router.get("/",async(req,res)=>{
    const qNew = req.query.new;
    const qCategory = req.query.category;

    try {
        let products;
        if(qNew){
            products = await productModel.find().sort({createdAt:-1}).limit(1);
        }
        else if(qCategory){
            products = await productModel.find({
                category:{ $in: [qCategory]}
            })
        }
        else{
            products=await productModel.find();
        }
        res.status(200).send(products);
    } catch (error) {
        res.status(500).json(error);
    }
})

module.exports=router