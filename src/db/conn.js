const mongoose=require("mongoose");

mongoose.connect("mongodb+srv://Rakshita:rakshita@cluster0.dbn8l.mongodb.net/registration?retryWrites=true&w=majority",{
  useNewUrlParser:true,
  useUnifiedTopology:true,
  useCreateIndex:true
}).then(function(){
  console.log(`connection succesfull`);
}).catch((e)=>{
  console.log(e);
})