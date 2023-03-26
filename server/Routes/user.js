const express = require('express');
const router = express.Router()
const {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
  } = require("./verifyToken");

const UserModel = require('../models/User');

//UPDATE
router.put('/:id',verifyTokenAndAuthorization, async (req,res)=>{
  const id = req.params.id;
  // res.send(id);
  try {
    const updateUser = await UserModel.findByIdAndUpdate(id,{
      $set:req.body
    },{new:true});
    res.status(200).send(updateUser);
  } catch (error) {
    res.status(500).json(error);
  }
})
//DELETE
router.delete('/:id',verifyTokenAndAuthorization,async(req,res)=>{
  try {
    await UserModel.findByIdAndDelete(req.params.id);
    res.status(200).json("user has been Deleted...");
  } catch (error) {
    res.status(500).json(error);
  }
})
//GET USER
router.get('/find/:id',verifyTokenAndAdmin,async(req,res)=>{
  const id = req.params.id;
  // res.send(id)
  try {
    const user = await UserModel.findById(req.params.id);
    if(!user){
      res.status(403).json("user doest not exist");
    }
    //Hide password
    const {password, ...others}= user._doc;
    res.status(200).send(others);
   
  } catch (error) {
    res.status(500).json(error);
  }
})

//GET ALL USERS
router.get('/',verifyTokenAndAdmin, async(req,res)=>{
  const query = req.query.new;
 
  try {
    const users = query? await UserModel.find().sort({_id:-1}).limit(5) : await UserModel.find()
    if(!users){
      res.status(401).json("No user Exist");
    }
    res.status(200).send(users);
  } catch (error) {
    res.status(500).json(error);
  }
})    

//GET STATS
router.get('/stats',verifyTokenAndAdmin,async(req,res)=>{
  const date = new Date();
  
  const lastYear = new Date(date.setFullYear(date.getFullYear()-1));
  try {
    const data = await UserModel.aggregate([

      {$match: {createdAt:{$gte: lastYear}}}, //greater than last year and matched with createdAt
      {
        $project:{
          month:{$month:"$createdAt"},
        },
      },
      {
        $group:{
          _id:"$month",
          total:{$sum:1},
        },
      },
    ]);
    res.status(200).send(data);
  } catch (error) {
    res.status(500).json(error);
  }
  

})

module.exports=router
