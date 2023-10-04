//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");



const app = express();

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://127.0.0.1:27017/userDB",{useNewUrlParser:true});
app.get("/",(req,res)=>{
    res.render("home");
})

app.get("/login",(req,res)=>{
    res.render("login");
})

app.get("/register",(req,res)=>{
    res.render("register");
})

//mongoose code...

const userSchema = new mongoose.Schema({
    email:String,
    password:String
});

userSchema.plugin(encrypt, { secret:process.env.SECRET,encryptedFields:["password"] });

const User = new mongoose.model("User",userSchema);

app.post("/register",(req,res)=>{
    
    const newUser = new User({
        email:req.body.username,
        password:req.body.password
    })
    newUser.save()
        .then((result)=>{
            console.log("saved successfully :",result);
            res.render("secrets");
        })
        .catch((err)=>{
            console.log(err);
        })
});

app.post("/login",(req,res)=>{
    const username = req.body.username;
    const password = req.body.password
    User.findOne({email:username})
        .then((item)=>{
            if (item.password ===  password){
                res.render("secrets");
            }
        })
        .catch((err)=>{
            console.log("user not found...",err);
        })
});


app.listen(3000,()=>{
    console.log("server started on the port 3000.");
})