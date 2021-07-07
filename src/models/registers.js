const mongoose=require("mongoose");

const registerSchema = new mongoose.Schema({
  firstname:{
    type:String,
    required:true
  },
  lastname:{
    type:String,
    required:true
  },
  phone:{
    type:Number,
    required:true,
    unique:true
  },
  email:{
    type:String,
    required:true,
    unique:true
  },
  password:{
    type:String,
    required:true
  },
  confirmpassword:{
    type:String,
    required:true
  }
})

const Register=new mongoose.model("Register",registerSchema);

module.exports=Register;