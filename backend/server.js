require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

// Database connection
require("./db");

// Routes
const authRoutes = require("./routes/auth");
const domainRoutes=
require("./routes/domain");


const mailboxRoutes =
require("./routes/mailbox");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended:true }));
app.use(cors());


// API Routes
app.use("/api/auth", authRoutes);
app.use(
"/api/domain",
domainRoutes
);
app.use(
"/api/mailbox",
mailboxRoutes
);
// Serve frontend
app.use(
express.static(
path.join(__dirname,"../frontend")
)
);


// Home page
app.get("/",(req,res)=>{

res.sendFile(
path.join(
__dirname,
"../frontend/index.html"
)
);

});


// Server status check
app.get("/api/status",(req,res)=>{

res.json({

success:true,
message:"Server running"

});

});


// 404
app.use((req,res)=>{

res.status(404).json({

success:false,
message:"Route not found"

});

});


const PORT=process.env.PORT || 3000;

app.listen(PORT,()=>{

console.log(`
==================================
MailSphere Running
Open: http://localhost:${PORT}
==================================
`);

});