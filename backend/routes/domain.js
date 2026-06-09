const express = require("express");

const db = require("../db");

const verifyToken =
require("../middleware/authMiddleware");

const router = express.Router();


// ADD DOMAIN
router.post(
"/add",
verifyToken,
(req,res)=>{

const user_id =
req.user.id;

const { domain_name } =
req.body;


// Validation
if(!domain_name){

return res.status(400).json({

success:false,
message:"Domain required"

});

}


db.query(

"INSERT INTO domains(user_id,domain_name) VALUES(?,?)",

[user_id,domain_name],

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
message:"Domain added"

});

}

);

});



// GET USER DOMAINS
router.get(
"/all",
verifyToken,
(req,res)=>{

const user_id =
req.user.id;

db.query(

"SELECT * FROM domains WHERE user_id=?",

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
domains:result

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

"DELETE FROM domains WHERE id=? AND user_id=?",

[id,user_id],

(err,result)=>{

if(err){

return res.status(500).json({
success:false
});

}

return res.json({
success:true,
message:"Domain deleted"
});

}

);

});
module.exports = router;