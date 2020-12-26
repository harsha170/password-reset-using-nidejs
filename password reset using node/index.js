const express = require("express");
const mongodb = require("mongodb");
const cors = require("cors");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
require("dotenv").config();

const mongoClient = mongodb.MongoClient;
const objectId = mongodb.ObjectID;

const app = express();
const dbURL = "mongodb+srv://harsha:8tt65gWx8bWptluV@password-recovery.a6ytp.mongodb.net/<dbname>?retryWrites=true&w=majority";
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());

app.get("/", async (req, res) => {
  try {
    let clientInfo = await mongoClient.connect(dbURL);
    let db = clientInfo.db("studentDetails");
    let data = await db.collection("users").find().toArray();
    res.status(200).json({ data });
    clientInfo.close();
  } catch (error) {
    console.log(error);
    res.send(500);
  }
});

app.post("/add-user", async (req, res) => {
  try {
    let clientInfo = await mongoClient.connect(dbURL);
    let db = clientInfo.db("studentDetails");
    let data = await db.collection("users").insertOne(req.body);
    res.status(200).json({ message: "User created" });
    clientInfo.close();
  } catch (error) {
    console.log(error);
    res.send(500);
  }
});

app.get("/get-user/:id", async (req, res) => {
  try {
    let clientInfo = await mongoClient.connect(dbURL);
    let db = clientInfo.db("studentDetails");
    let data = await db
      .collection("users")
      .findOne({ _id: objectId(req.params.id) });
    res.status(200).json({ data });
    clientInfo.close();
  } catch (error) {
    console.log(error);
    res.send(500);
  }
});

app.post("/register", async (req, res) => {
  try {
    let clientInfo = await mongoClient.connect(dbURL);
    let db = clientInfo.db("studentDetails");
    let result = await db
      .collection("users")
      .findOne({ email: req.body.email });
    if (result) {
      res.status(400).json({ message: "User already registered" });
      clientInfo.close();
    } else {
      let salt = await bcrypt.genSalt(15);
      let hash = await bcrypt.hash(req.body.password, salt);
      req.body.password = hash;
      await db.collection("users").insertOne(req.body);
      res.status(200).json({ message: "User registered" });
      clientInfo.close();
    }
  } catch (error) {
    console.log(error);
  }
});

app.post("/login", async (req, res) => {
  try {
    let clientInfo = await mongoClient.connect(dbURL);
    let db = clientInfo.db("studentDetails");
    let result = await db
      .collection("users")
      .findOne({ email: req.body.email });
    if (result) {
      let isTrue = await bcrypt.compare(req.body.password, result.password);
      if (isTrue) {
        res.status(200).json({ message: "Login success" });
      } else {
        res.status(200).json({ message: "Login unsuccessful" });
      }
    } else {
      res.status(400).json({ message: "User not registered" });
    }
  } catch (error) {
    console.log(error);
  }
});

//$2b$15$EP3TOevawMxU66lL0pxD2.jqqug1LKdQayLrPZpwWjviZWvWbFeM.
//$2b$15$EP3TOevawMxU66lL0pxD2.jqqug1LKdQayLrPZpwWjviZWvWbFeM.
//$2b$15$EP3TOevawMxU66lL0pxD2.jqqug1LKdQayLrPZpwWjviZWvWbFeM.
//$2b$15$EP3TOevawMxU66lL0pxD2.jqqug1LKdQayLrPZpwWjviZWvWbFeM.



app.post('/forgot-password',async(req,res)=>{

    try {
        let clientInfo = await mongoClient.connect(dbURL)
        let db =  clientInfo.db("studentDetails")
        let result = await db.collection("users").findOne({email:req.body.email})
        if (result) {
            var string = Math.random().toString(36).substr(2,10)
            let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false,
                auth: {
                  user: 'hkurumindla@gmail.com', // generated ethereal user
                  pass: 'Ajay@2554', // generated ethereal password
                },
            });
                let info = await transporter.sendMail({
                    from: 'hkurumindla@gmail.com', 
                    to:  'harsha.ajay@hotmail.com', 
                    subject: "Reset Password ", 
                    text: "Reset password", 
                    html: `<p>Here is the link to reset your password</p><br><a href="http://localhost:3000/auth/${req.body.email}/${string}">Click here</a>`, 
                  });
            res.status(200).json({message:"user exists"})
            clientInfo.close()
        } else {
            res.status(400).json({message:"user doesn't exist"})
            
        }
        
    } catch (error) {
        console.log(error)
    }
})


app.get('/auth/:email/:string', async (req,res)=>{
  try {
     let clientInfo = await mongoClient.connect(dbURL)
     let db = clientInfo.db("studentDetails")
     let result = await db.collection('users').findOne({email: req.params.email})
console.log(result)
     //if(result.string == req.params.string){
    if(result ){
       res.redirect(`http://127.0.0.1:5501/reset.html?${req.params.email}?${req.params.string}`)
     }
     else{
      res.status(200).json({message:`link expired`})
     }
  } catch (error) {
    console.log(error)
  }
})


app.put('/resetpassword/:mail', async(req,res)=>{
  try {
    // console.log(req.params.mail)
    // console.log(req.body.password)
    let clientInfo = await mongoClient.connect(dbURL)
    let db = clientInfo.db("studentDetails")
    let result = await db.collection('users').updateOne({email: req.params.mail}, {$set:{'password': req.body.password}})
    if(result){
      res.status(200).json({
        message: 'password updated'
      })
    }
    else{
      res.status(400).json({
        message:"password update unsuccessfull "
      })
    }
  } catch (error) {
    console.log(error)
  }
})


app.listen(port, () => console.log("your app runs with port:", port));
