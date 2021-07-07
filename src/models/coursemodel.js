
const mongoose=require("mongoose");

const courseSchema=new mongoose.Schema({
  coursename:String,
  completed:{
    type:Boolean,
    default:false
  }
})


const Course=new mongoose.model("Course",courseSchema);

module.exports=Course;