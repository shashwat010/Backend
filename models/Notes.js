const mongoose=require('mongoose');
const {Schema}=mongoose;

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
        default:Date.now
    },
})

const notes=mongoose.model('notes',notesSchema);
module.exports=notes;