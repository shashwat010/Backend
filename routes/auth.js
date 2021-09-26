const express=require('express');
const router=express.Router();
const { body, validationResult } = require('express-validator');
const User=require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

    // Saving to DB, if there are no errors
    try{
    let user=await User.findOne({email:req.body.email});
    if(user){
        return res.status(400).json({error:'Sorry!! User with this email already exists '})
    }

    const salt =await bcrypt.genSaltSync(10);
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
      const authToken=jwt.sign(data,"e8rg9uri0d");
      res.json({authToken})
    }
    
    catch(error){
        console.error(error.message);
        res.status(500).send('Some error occured');
    }
})

module.exports=router;