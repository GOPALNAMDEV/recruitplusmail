const express = require("express");
const bcrypt = require("bcrypt");

const db = require("../db");

const verifyToken =
require("../middleware/authMiddleware");

const router = express.Router();


// CREATE MAILBOX
router.post(
"/create",
verifyToken,
async(req,res)=>{

try{

const user_id =
req.user.id;

const {
domain_id,
email,
password,
storage_limit
} = req.body;


// Validation
if(
user_id == null ||
domain_id == null ||
!email ||
!password
){

return res.status(400).json({

success:false,
message:"All fields required"

});

}


// Encrypt password
const hashedPassword =
await bcrypt.hash(password,10);


// Save mailbox
db.query(

`INSERT INTO mailboxes
(user_id,domain_id,email,password,storage_limit)
VALUES(?,?,?,?,?)`,

[
user_id,
domain_id,
email,
hashedPassword,
storage_limit || 2
],

(err,result)=>{

if(err){

return res.status(500).json({

success:false,
message:"Database error",
error:err

});

}

return res.json({

success:true,
message:"Mailbox created"

});

}

);

}
catch(error){

return res.status(500).json({

success:false,
message:"Server error",
error:error

});

}

});



// GET USER MAILBOXES
router.get(
"/all",
verifyToken,
(req,res)=>{

const user_id =
req.user.id;

db.query(

"SELECT * FROM mailboxes WHERE user_id=?",

[user_id],

(err,result)=>{

if(err){

return res.status(500).json({

success:false,
message:"Database error",
error:err

});

}

return res.json({

success:true,
mailboxes:result

});

}

);

});
router.delete(
"/delete/:id",
verifyToken,
(req,res)=>{

const user_id = req.user.id;
const id = req.params.id;

db.query(

"DELETE FROM mailboxes WHERE id=? AND user_id=?",

[id,user_id],

(err,result)=>{

if(err){

return res.status(500).json({
success:false
});

}

return res.json({
success:true,
message:"Mailbox deleted"
});

}

);

});


module.exports = router;