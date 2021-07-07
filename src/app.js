const express=require("express");
const bodyparser=require("body-parser");
const path=require("path");
require("./db/conn");
const Register=require("./models/registers");
const Task=require("./models/taskmodel");
const Course=require("./models/coursemodel");
var cookieParser = require('cookie-parser');

var app=express();

app.use(cookieParser());

const static_path=path.join(__dirname,"../public");
const templates_path=path.join(__dirname,"../templates/views");


const hbs=require("ejs");


app.use(express.urlencoded({extended:false}));

app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json());

app.use(express.static(static_path));
// app.set("view engine","hbs");
app.set("view engine","ejs");

app.set("views",templates_path);

app.get("/",function(req,res){
  res.render("register");
})

//home
app.get("/index",function(req,res){
    res.render("index");
})

//logout
app.get("/logout",function(req,res){
  res.redirect("/login");
})

//registration
app.get("/register",function(req,res){
  res.render("register");
})

app.post("/register",async (req,res)=>{
 try{
  const password = req.body.password;
  const cpassword = req.body.confirmpassword;

  if(password === cpassword){
    const registerUser=new Register({
      firstname:req.body.firstname,
      lastname:req.body.lastname,
      phone:req.body.phone,
      email:req.body.email,
      password:password,
      confirmpassword:cpassword
    })

    var registered = await registerUser.save();
    res.status(201).render("login");
  }
  else{
    res.send("passwords are not matching");
  }
 }catch(error){
  res.status(400).send(error);
 }
})

//login check

app.get("/login",async function(req,res){
  res.render("login");
})

app.post("/login",async(req,res)=>{
  try{

    const email=req.body.email;
    const password=req.body.password;
    
    const userEmail = await Register.findOne({email:email});

    if(userEmail.password === password){
      res.cookie("email", email);
    
      res.status(201).redirect("index");   
    }else{
      res.send("password are not matching");
    }
  }catch(error){
    res.status(400).send("invalid email");
  }
})

//profile view and update
app.get("/profileview",async function(req,res){
  var userEmail=req.cookies.email;
 
  Register.findOne({email:userEmail},function(err,result){
    res.render("profileview",{item:result});
  })
})

app.post("/profileview",async (req,res)=>{
  res.render("profileupdate");
})

app.get("/profileupdate",async function(req,res){



  var userEmail=req.cookies.email;
 
  Register.findOne({email:userEmail},async function(err,result){
    res.render("profileupdate",{item:result});
  })
})

app.post("/profileupdate",async (req,res)=>{
 
  var userEmail=req.cookies.email;
 
  Register.findOne({email:userEmail},async function(err,result){
    res.render("profileupdate",{item:result});
   
  })

  const fname=req.body.firstname;
  const lname=req.body.lastname;
  const phn=req.body.phone;
  const pass=req.body.password;
  const cpass=req.body.confirmpassword;

  Register.findOneAndUpdate({email:userEmail},{$set:{firstname:fname,lastname:lname,phone:phn,password:pass,confirmpassword:cpass}},function(err,res){
    if(err){
      console.log(err);
    }else{
      console.log("updated successfully"); 
    
    }
 
  });


})

//task manager
app.get("/addtask",async function(req,res){

  var mytasks;
  Task.find({},async function(err,data){
    if(data){
      mytasks=data;
      
    }else{
        console.log(err);
    }
    res.render("tasks",{data:mytasks});
  })
  
})

app.post("/addtask",async(req,res)=>{

  const taskname=req.body.task;
  const date=req.body.date;
  const task=new Task({
    taskname:taskname,
    date:date
  })

  var taskadded = await task.save(async function(err,doc){
    if(err){
      console.log(err);
    }
    res.redirect("/addtask");
  });
})

app.post("/deletetask",async (req,res)=>{

  
  const id=req.body.id;
  Task.findOneAndDelete({_id:id},(err,doc)=>{
    res.redirect("/addtask");
  })
})

app.post("/updatetask",async (req,res)=>{
  const id=req.body.id;

  Task.findOneAndUpdate({_id:id},{completed:true},(err,doc)=>{
    res.redirect("/addtask");
  })
})

//courses
var react=new Course({
  coursename:"React",
  completed:false
})

var ethicalHacking=new Course({
  coursename:"Ethical Hacking",
  completed:false
})

var dataScience=new Course({
  coursename:"Data Science",
  completed:false
})

var adobePhotoshop=new Course({
  coursename:"Adobe Photoshop",
  completed:false
})

const defaultArray=[react,ethicalHacking,dataScience,adobePhotoshop];

app.get("/courses",async (req,res)=>{
  Course.find({},function(err,foundItems){
  
    if(foundItems.length === 0){
      Course.insertMany(defaultArray,function(err){
        if(err){
        console.log(err);
        }else{
        console.log("successfully inserted default items to DB");
        res.redirect("/courses");
        }
      })
    }else{
      res.render("courses");
    } 
  })
})

app.get("/visitreact",(req,res)=>{

  Course.findOne({coursename:"React"},(err,course)=>{
    var result=course.completed;
    
      res.render("react",{data:result});  
  })
})
app.post("/visitreact",(req,res)=>{
  Course.findOneAndUpdate({coursename:"React"},{completed:true},(err,doc)=>{
    if(!err){
      res.redirect("/visitreact");
    }else{
      console.log(err);
    }
  })
})


app.get("/visitadobe",(req,res)=>{
  Course.findOne({coursename:"Adobe Photoshop"},(err,course)=>{
    var result=course.completed;
    
      res.render("adobe",{data:result});  
  })
})
app.post("/visitadobe",(req,res)=>{
  Course.findOneAndUpdate({coursename:"Adobe Photoshop"},{completed:true},(err,doc)=>{
    if(!err){
      res.redirect("/visitadobe");
    }else{
      console.log(err);
    }
  })
})


app.get("/visithack",(req,res)=>{
  Course.findOne({coursename:"Ethical Hacking"},(err,course)=>{
    var result=course.completed;
    
      res.render("hack",{data:result});  
  })
})
app.post("/visithack",(req,res)=>{
  Course.findOneAndUpdate({coursename:"Ethical Hacking"},{completed:true},(err,doc)=>{
    if(!err){
      res.redirect("/visithack");
    }else{
      console.log(err);
    }
  })
})


app.get("/visitdatascience",(req,res)=>{
  Course.findOne({coursename:"Data Science"},(err,course)=>{
    var result=course.completed;
    
      res.render("datascience",{data:result});  
  })
})
app.post("/visitdatascience",(req,res)=>{
  Course.findOneAndUpdate({coursename:"Data Science"},{completed:true},(err,doc)=>{
    if(!err){
      res.redirect("/visitdatascience");
    }else{
      console.log(err);
    }
  })
})


//server

app.listen(process.env.PORT || 3000,function(){
  console.log("server is  running on port 3000");
})