const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const {
  sendWelcomeEmail
} = require("../utils/emailController");
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.EXPIRES_IN,
  });
};

//function to create and send token
const createSendToken = (user, statuscode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
  };

  res.cookie("jwtToken", token, cookieOptions);

  // console.log("----------token-----------");
  // console.log(token);

  res.status(statuscode).json({
    status: "success",
    token,
    data: {
      user: user,
    },
  });
};

exports.signup = catchAsync(async (req, res) => {
  //creating documents using the model
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
  });

  //sending the response only
  res.status(200).json({
    status: "success",
    data: {
      user: newUser,
    },
  });
  sendWelcomeEmail(req.body.email,req.body.name);

});

exports.login = catchAsync(async (req, res, next) => {
  //need to read the email and password from the req.body and we use destructuring of the object
  const { email, password } = req.body;

  //1.if the email and password is exist
  if (!email || !password) {
    // return next(new AppError('Please provide email & password',400));
    return res.status(400).json({
      status: "fail",
      message: "Please provide email & password",
    });
  }
  //2.if the user exists && password is correct

  //need to compare the user given password and database password
  //checking whether the user existst by checking for the email and password

  //here the provided password is in not encrpted but password stored in the database is encrypted so if the user exists with the provided email then password of that user is extracted then later on the password-provided----candidatePassword----and user.password that is extracted from the database is compared by the help of the function called-----correctPassword--------that is present in the------userModel.js----as we are making this function as instance method that will be available to all the document/collection
  const user = await User.findOne({ email }).select("+password");

  //here correctPassword method is a instance method that is a method which is available to all the instance of the document collection
  //For the instance method it is more related to the document (model) so we put the method in userModel
  // so correctPassword() have to be in ---------userModel-----------
  if (!user || !(await user.correctPassword(password, user.password))) {
    //   return next(new AppError('Incorrect Email or Incorrect password',400));
    return res.status(400).json({
      status: "fail",
      message: "Incorrect Email or Incorrect password",
    });
  }

  //3.if the everthing is okay then send token to the client
  createSendToken(user, 200, res);
});

exports.logout = (req,res)=>{
  res.cookie('jwtToken','Loggedout',{
    maxAge: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  })

  res.status(200).json({status:'success'});
}

//this middleware for the protect section where inorder to access the data of the campaign the user must be logged in --->generates the token-----and then only the campaign will be visible to the user
exports.protect = async (req, res, next) => {
  // read the token and check if it exists
  let token;
  let cookie;
  // console.log('--------req.headers------');
  // console.log(req.headers);

  // console.log('--------req.headers.cookie------');
  // console.log(req.headers.cookie);

  if (req.headers.cookie) {
    token = req.headers.cookie.split("=")[1];
  }

  // console.log("--------token------");
  // console.log(token);
  // console.log("Token verification completed");

  //if token is not present then triger error
  if (!token) {
    // return next(new AppError("You are not logged In!!! Please log in again",401));
    return res.status(401).json({
      status: "fail",
      message: "You are not logged In!!! Please log in again",
    });                 
  }
  // console.log("------------------");
  // console.log("working");
  // console.log("------------------");
  //verifying the token
  //here the callback function is converted to the promise using the promisifying method that we have the util section as it is more easy to handle the promise rather than callback function which may lead to the callback hell condition so
  // console.log('expected error section');
  let decoded;
  try {
    decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({
      status: "fail",
      messsage: "JWT expires",
    });
  }

  // console.log(decoded);
  // console.log("expected error section end");

  //check whether the user exists
  const freshUser = await User.findById(decoded.id);
  // console.log(freshUser);

  if (!freshUser) {
    //  return next(new AppError('The user belonging to this token does no longer exists',401));
    return res.status(401).json({
      status: "fail",
      message: "The user belonging to this token does no longer exists",
    });
  }

  //GRANT ACCESS  TO PROTECTED DATA
  req.user = freshUser;
  next();
};

//isLogged in
exports.isLoggedIn = async (req, res, next) => {

  if (req.headers.cookie) {
    try{
      token = req.headers.cookie.split("=")[1];

      //verifying the token
      //here the callback function is converted to the promise using the promisifying method that we have the util section as it is more easy to handle the promise rather than callback function which may lead to the callback hell condition so
      // console.log('expected error section');
      const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  
      //check whether the user exists
      const currentUser = await User.findById(decoded.id);
  
  
      if (!currentUser) {
        return next();
      }
  
      //There is a logged in user
      //res.locals.user will make the user or current user available in the template where we can access all the values inside the user
      res.locals.user = currentUser;
      return next();
    }catch(e){
      return next();
    }

  }
  next();
};
