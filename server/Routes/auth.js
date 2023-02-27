const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserModel = require('../models/User');


//REGISTER
router.post('/register',async(req,res)=>{
    try{
        const username = req.body.username;
        const email = req.body.email;
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(req.body.password,salt);
        if(!email || !password){
            res.status(401).json("please provide Email or Password");
        }
        const matchEmail = await UserModel.findOne({email:email});
        if(matchEmail){
            res.status(400).json("Email is already exist");
        }
        const newUser = new UserModel({
            username:username,
            email:email,
            password:password
        })
        const savedUser = await newUser.save();

        //add jwt
        const token = jwt.sign({id: savedUser._id, isAdmin:savedUser.isAdmin},process.env.jwtKey,{expiresIn:'3d'});

        res.status(200).send({savedUser,token});

    }
    catch(error){
        if (!res.headersSent) {
            return res.status(500).json(error);
        }
    }
})

//LOGIN
router.post('/login',async(req,res)=>{
    try {
        
        //check email
        const user = await UserModel.findOne({email:req.body.email})
        if(!user){
            res.status(400).json("Email or Password Incorrect");
        }
        //comapare Password
        const isCompare = await bcrypt.compare(req.body.password,user.password);
        if(!isCompare){
            res.status(400).json("Email or Password Incorrect");
        }
        //hide password 
        const { password, ...others}=user._doc;

        //add jwt
        const token = jwt.sign({id: user._id, isAdmin:user.isAdmin},process.env.jwtKey,{expiresIn:'3d'});
        res.status(200).send({others,token});
        
    } catch (error) {
        if (!res.headersSent) {
            return res.status(500).json(error);
        }
    }
})
module.exports = router;