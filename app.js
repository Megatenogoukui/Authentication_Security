//jshint esversion:6
import express from 'express'
import bodyParser from 'body-parser'
import ejs from 'ejs'
import mongoose from 'mongoose';

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine" , "ejs");

//Connecting with Database using Mongoose
mongoose.connect("mongodb://localhost:27017/SecretUserDB" ,{family : 4});

//Creating the collection schema
const userDBSchema = new mongoose.Schema({
    username : String,
    password: String
});



//Creating a model of that schema
const UserDB = mongoose.model("userDB" , userDBSchema);

//Handling the POST route for register
app.post("/register" , async (req,res) => {
    try{
        //Creatwed a new user according to the schema
        const user = new UserDB({
            username : req.body.username,
            password : req.body.password
        })
        //Inserted the user inside the database 
        user.save();
        //rendering the secrets page 
        res.render("secrets")
    }
    catch(err){
        res.send(err);
    }
});

//Handling the POST route for login
app.post("/login" , async (req,res) => {
    try{
       
        //Checking if the User is present in the data base or not
        const found = await UserDB.findOne({username:req.body.username});
        //If the username is present in th database render secrets page
        if (found){
            //Checking if the password matches
            if (found.password === req.body.password){
                res.render("secrets");
            }
            else{
                res.render("home")
            }
        }

        // else go to Home page
        else{
            res.render("home")
        }
    }
    catch(err){
        res.send(err);
    }
});





//Get route for Home page
app.get("/" , (req , res) => {
    res.render("home");
});

//Get route for Register page
app.get("/register" , (req , res) => {
    res.render("register");
});

//Get route for Login page
app.get("/login" , (req , res) => {
    res.render("login");
});









app.listen(port , ()=> {
    console.log(`Listening to port ${port}`);
})