const orderModel=require('../models/Order')
const express = require('express');
const router = express.Router();
const { verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin}= require('./verifyToken');

//CREATE
router.post("/",verifyToken,async(req,res)=>{
    const newOrder = new orderModel(req.body);
    try {
        const saveOrder = await newOrder.save();
        res.status(200).send(saveOrder);
    } catch (error) {
        res.status(500).json(error);
    }
})

//UPDATE
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
      const updatedOrder = await orderModel.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedOrder);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  //Delete
  router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
      await orderModel.findByIdAndDelete(req.params.id);
      res.status(200).json("Order has been deleted...");
    } catch (err) {
      res.status(500).json(err);
    }
  });

  //GET USER ORDERS
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
    try {
      const orders = await orderModel.find({ userId: req.params.userId });
      res.status(200).json(orders);
    } catch (err) {
      res.status(500).json(err);
    }   
  });

 //GET ALL

router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try {
      const orders = await orderModel.find();
      res.status(200).json(orders);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  //GET MONTHLY INCOME
  router.get("/income",verifyTokenAndAdmin,async(req,res)=>{
    const productId = req.params.pid;
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth()-1));
    const prevMonth = new Date(new Date().setMonth(lastMonth.getMonth()-1));

    try {
      const income = await orderModel.aggregate([
        {
          $match:{
            createdAt: {$gte: prevMonth},
            ...(productId && {
                products:{ $elemMatc:{productId} },
            })
          }
        
        },
        {
          $project:{
            month:{$month: "$createdAt"},
            sales:"$amount",
          },
        },
        {
           $group:{
            _id:"$month",
            total:{$sum:"$sales"},
           },
        },
      ]);
      res.status(200).json(income);
    } catch (error) {
      res.status(500).json(error);
    }
  })
  
  module.exports=router;