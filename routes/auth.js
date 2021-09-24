const express=require('express');
const router=express.Router();

router.get('/',(req,res)=>{
    const obj={
        name:'johny',
        number:34,
        date:new Date().toDateString()
    }
    res.json(obj);
})

module.exports=router;