const mongoose = require('mongoose');

const Registeruser = new mongoose.Schema({
    username : {
        type : String
    },
    email : {
        type : String
    },
    password : {
        type : String
    },
    confirmPassword : {
        type : String
    }
})

module.exports = mongoose.model("Registeruser" , Registeruser);