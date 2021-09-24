const mongoose=require('mongoose');

const notesSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    desc:{
        type:String,
        required:true,
    },
    tag:{
        type:String,
    },
    date:{
        type:Date,
        required:true
    },
})

module.exports=mongoose.Schema('user',notesSchema);