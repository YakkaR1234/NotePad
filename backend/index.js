require("dotenv").config();


const config=require("./config.json");
const mongoose=require("mongoose"); 

mongoose.connect(config.connectionString);

const User=require("./models/user.model")


const express=require("express");
const cors=require("cors");
const app=express();


const jwt=require("jsonwebtoken");
const {authenticationToken}=require("./Utilities");

app.use(express.json());

app.use(
    cors({
        origin:"*",

    })
);

app.get("/",(req,res)=>{
    res.json({data:"hello"});
});

//create account
app.post("/create-account",async (req,res)=>{
    const {fullName,email,password}=req.body;

    if(!fullName){
        return res.status(400).json({error:true,message:"full name is requried"});
    }

    if(!email){
        return res.status(400).jason({error:true,message:"Email is required"});
    }
    if(!password){
        return res.status(400).json({error:true,message:"password is required"});
    }

    const isUser=await User.findOne({email:email});

    if(isUser){
        return res.json({
            error:true,
            message:"User already exist",
        });
    }

    const user=new User({
        fullName,email,password
    });

    await user.save();

    const accessToken=jwt.sign({user},process.env.ACCESS_TOKEN_SECRET,{expiresIn:"30000M"});

    return res.json({error:false,user,accessToken,message:"Registeration Successful"});


});

app.listen(8000);
module.exports=app;