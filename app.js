//jshint esversion:6
 ///////////////////////////////////////setup
 
const express = require("express");
const ejs = require("ejs");
const body_parser = require('body-parser');
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption")

const app = express();
app.set("view engine",'ejs');
app.use(express.static("public"));
app.use(body_parser.urlencoded({extended:true}));
///////////////////////////////////////////connection to the databse
mongoose.connect("mongodb://127.0.0.1:27017/userDB",{useNewUrlParser : true});
const db = mongoose.connection
 db.on("error",console.error.bind(console,"Connection error"));
 db.once("open",function(){
    console.log("Coonnected to the MongoDB");
 });

///////////////////creating Schemas

const userSchema = new mongoose.Schema({
    email : String , 
    password : String
});

const secret = "Thisisourlittlesecret."
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] });

const User = new mongoose.model("User",userSchema);


///////////////////////////////////////home page
app.get("/",function(req,res){
    res.render("home");
});


//////////////////////////////////////log in routes

app.route("/login")

    .get(function(req,res){
        res.render("login");
    })
    .post(function(req,res){
        const userName = req.body.username;
        const password = req.body.password;
        User.findOne({email : userName}).then(function(user){
            if(user){
                if(user.password === password){
                    res.render("secrets");
                }
            }
        }).catch(function(err){
            console.log(err);
        })
    });

//////////////////////////////////////registered routes

app.route("/register")
   .get(function(req,res){
    res.render("register");
   })
   .post(function(req,res){
            const user = new User({
                email : req.body.username1,
                password : req.body.password
            });
            user.save().then(function(){
                res.render("secrets");
            }).catch(function(err){
                console.log(err);
            });
    });



app.listen(3000,function(){
    console.log("Server started on 3000");
})

