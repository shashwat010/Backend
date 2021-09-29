const express=require('express');
const router=express.Router();
const { body, validationResult } = require('express-validator');
const User=require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchUser');

const JWT_SECRET="Myname@shashwat!"

//ROUTE1: Adding user at /api/auth/createuser 
router.post('/createuser',[
    // Adding Valiadator 
    body('name','Enter a valid name of minimum 3 characters').isLength({ min: 3 }),
    body('email','Enter a valid email').isEmail(),
    body('password','Password must be of atleast 5 characters').isLength({ min: 5 }),
],async (req,res)=>{
    // Checking for errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array()})
    }
    
    try{
        // Saving to DB, if there are no errors
    let user=await User.findOne({email:req.body.email});
    if(user){
        return res.status(400).json({error:'Sorry!! User with this email already exists '})
    }

    // Hashing Password using bcrypt
    const salt =bcrypt.genSaltSync(10);
    const securePass=await bcrypt.hash(req.body.password,salt);
    user= await User.create({
        name: req.body.name,
        email: req.body.email,
        password: securePass,
      })

      const data={
          user:{
              id:user.id
          }
      }
      const authToken=jwt.sign(data,JWT_SECRET);
      res.json({authToken})
    }
    
    catch(error){
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
})

//ROUTE2: Authencate user at /api/auth/login
router.post('/login',[
    // Adding Valiadator 
    body('email','Enter a valid email').isEmail(),
    body('password','Password cannot be blank').exists(),
],async (req,res)=>{
    // Checking for errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array()})
    }

    const {email,password}=req.body;
    try{
        let user=await User.findOne({email});
        if(!user){
            return res.status(400).json({error:"Please login with correct credintials"});
        }

        const passwordCompare=await bcrypt.compare(password,user.password);
        if(!passwordCompare){
            return res.status(400).json({error:"Please login with correct credintials"});
        }

        const data={
            user:{
                id:user.id
            }
        }
        const authToken=jwt.sign(data,JWT_SECRET);
        res.json({authToken})

    }
    catch(error){
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
})

//ROUTE3: Authencate user at /api/auth/user
router.post('/user',fetchuser,async (req,res)=>{
    try {
        userId=req.user.id;
        const user=await User.findById(userId).select("-password");
        res.send(user);        
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
})

module.exports=router;