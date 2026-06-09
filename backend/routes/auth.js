const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db");

const router = express.Router();


// SIGNUP
router.post("/signup", async(req,res)=>{

try{

const {name,email,password}=req.body;

if(!name || !email || !password){

return res.status(400).json({
success:false,
message:"All fields required"
});

}

db.query(
"SELECT * FROM users WHERE email=?",
[email],

async(err,result)=>{

if(err){

return res.status(500).json(err);

}

if(result.length>0){

return res.status(400).json({
success:false,
message:"Email already exists"
});

}

const hashedPassword=
await bcrypt.hash(password,10);

db.query(

"INSERT INTO users(name,email,password) VALUES(?,?,?)",

[name,email,hashedPassword],

(err,data)=>{

if(err){

return res.status(500).json(err);

}

return res.json({

success:true,
message:"Signup successful"

});

}

);

}

);

}
catch(error){

return res.status(500).json(error);

}

});


// LOGIN
router.post("/login",(req,res)=>{

const {email,password}=req.body;

if(!email || !password){

return res.status(400).json({
success:false,
message:"All fields required"
});

}

db.query(

"SELECT * FROM users WHERE email=?",
[email],

async(err,result)=>{

if(err){

return res.status(500).json(err);

}

if(result.length===0){

return res.status(404).json({
success:false,
message:"User not found"
});

}

const user=result[0];

const validPassword=
await bcrypt.compare(
password,
user.password
);

if(!validPassword){

return res.status(401).json({
success:false,
message:"Wrong password"
});

}

const token=jwt.sign(

{
id:user.id,
email:user.email
},

process.env.JWT_SECRET,

{
expiresIn:"7d"
}

);

return res.json({

success:true,
message:"Login successful",
token:token

});

}

);

});

module.exports=router;
