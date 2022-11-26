const mongoose = require('mongoose');
const validator = require('validator');

const adminSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please tell us your name!"],
    },
    email:{
        type:String,
        required:[true,"Please your calid email address!"],
        unique:true,
        lowercase:true,
        validate:[validator.isEmail,'Please provide a valid email!!!'],
    },
    photo:String,
    role:{
        type:String,
        default:'admin',
    },
    password:{
        type:String,
        required:[true,"Please provide a password!"],
        minlength:8,
        select:false
    },
    passwordConfirm:{
        type:String,
        required:[true,"Please confirm your password!"],
        validate:{
            validator:function(el){
                return el ===this.password;
            },
            message:"Password are not same"
           }
       },
});

//instance method that is related to the data stored in model
adminSchema.methods.correctPassword = function(candidatePassword,userPassword){
    // return await bcrypt.compare(candidatePassword,userPassword);
    return candidatePassword===userPassword;
} 

const Admin = mongoose.model('Admin',adminSchema);
module.exports = Admin;