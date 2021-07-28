const express = require('express');
const mongoose = require('mongoose');
const Registeruser = require('./model');
const jwt = require('jsonwebtoken');


const app = express();


mongoose.connect('mongodb+srv://auth:auth@cluster0.litiy.mongodb.net/auth?retryWrites=true&w=majority' ,{
    useUnifiedTopology: true ,
    useNewUrlParser: true,
    useCreateIndex : true
}).then(() => {
    console.log('DB connected')
})

app.use(express.json());


app.post('/register',async (req, res) =>{
    try{
        const {username,email,password,confirmPassword} = req.body;
        let exist = await Registeruser.findOne({email})
        if(exist){
            return res.status(400).send('User Already Exist')
        }
        if(password !== confirmPassword){
            return res.status(400).send('Passwords are not matching');
        }
        let newUser = new Registeruser({
            username,
            email,
            password,
            confirmPassword
        })
        await newUser.save();
        res.status(200).send('Registered Successfully')

    }
    catch(err){
        console.log(err)
        return res.status(500).send('Internel Server Error')
    }
})

app.post('/login',async (req, res) => {
    try{
        const {email,password} = req.body;
        let exist = await Registeruser.findOne({email : email});
        if(!exist) {
            return res.status(400).send('User Not Found');
        }
        if(exist.password !== password) {
            return res.status(400).send('Invalid credentials');
        }
        let payload = {
            user:{
                id : exist.id
            }
        }
        jwt.sign(payload,'jwtSecret',{expiresIn:3600000},
          (err, token) =>{
            //   if (err) throw err;
              if (err) {
                  console.log(err)
              } else {
                return res.json({token})
              }
             
          }  
            )

    }
    catch(err){
        console.log(err);
        return res.status(500).send('Server Error')
    }
})



app.listen(5000,()=>{
    console.log('Server running...')
})