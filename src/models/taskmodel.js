const mongoose=require("mongoose");

const taskSchema=new mongoose.Schema({
  taskname:{
    type:String,
    required:true
  },
  completed:{
    type:Boolean,
    default:false
  },
  date:{
    type:String,
    required:true
  },
  // image:String
})

const Task=new mongoose.model("Task",taskSchema);

module.exports=Task;