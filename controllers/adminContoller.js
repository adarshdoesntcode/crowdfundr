const { startOfDay, endOfDay } = require('date-fns')
const Admin = require("../models/adminModel");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const Campaign = require("../models/campaignModel");
const Transaction = require("../models/transactionModel");
const { find } = require('../models/adminModel');
const {
  approveAlertEmail,declineAlertEmail
} = require("../utils/emailController");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.EXPIRES_IN,
  });
};

//function to create and send token
const createSendToken = (admin, statuscode, res) => {
  const token = signToken(admin._id);

  const cookieOptions = {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
  };

  res.cookie("jwtToken", token, cookieOptions);
  console.log(token);
  console.log(admin);

  res.status(statuscode).json({
    status: "success",
    token,
    data: {
      admin: admin,
    },
  });
};

exports.adminLoginPage = (req, res) => {
  res.render("admin-login");
};

exports.adminPortal = (req, res) => {
  res.render("admin", {
    admin: req.admin.name,
  });
};

exports.signup = async (req, res) => {
  //creating documents using the model
  const newAdmin = await Admin.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  //sending the response only
  res.status(200).json({
    status: "success",
    data: {
      admin: newAdmin,
    },
  });
};

exports.login = async (req, res, next) => {
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
  const admin = await Admin.findOne({ email }).select("+password");

  //here correctPassword method is a instance method that is a method which is available to all the instance of the document collection
  //For the instance method it is more related to the document (model) so we put the method in userModel
  // so correctPassword() have to be in ---------userModel-----------
  if (!admin || !(await admin.correctPassword(password, admin.password))) {
    //   return next(new AppError('Incorrect Email or Incorrect password',400));
    return res.status(400).json({
      status: "fail",
      message: "Incorrect Email or Incorrect password",
    });
  }

  //3.if the everthing is okay then send token to the client
  createSendToken(admin, 200, res);
};

// -------LOGOUT----------

exports.logout = (req, res) => {
  res.cookie("jwtToken", "Loggedout", {
    maxAge: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).redirect("/admin/loginPage");
};

//---------------------list of unverified campaign------------------
exports.unverifiedCampaigns = async (req, res, next) => {
  const campaign = await Campaign.find({
    campaignStatus: "UNVERIFIED",
  }).sort({ createdAt: -1 });

  console.log(campaign);
  return res.status(200).json({
    status: "success",
    results: campaign.length,
    data: {
      campaign,
    },
  });
};

//---------------------campagin transactions------------------
exports.campaignsTransactions = async (req, res, next) => {
  const transactions = await Transaction.find().sort({
    createdAt:-1
  });

  return res.status(200).json({
    status: "success",
    result: transactions.length,
    data: {
      transactions,
    },
  });
};

//---------------------------admin protect---------------------------
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
      message: "You are not logged In as admin!!! Please log in again as admin",
    });
  }
  // console.log("------------------");
  // console.log("working");
  // console.log("------------------");
  // //verifying the token
  // //here the callback function is converted to the promise using the promisifying method that we have the util section as it is more easy to handle the promise rather than callback function which may lead to the callback hell condition so
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
  const freshAdmin = await Admin.findById(decoded.id);
  // console.log(freshUser);

  if (!freshAdmin) {
    //  return next(new AppError('The user belonging to this token does no longer exists',401));
    return res.status(401).json({
      status: "fail",
      message: "The admin belonging to this token does no longer exists",
    });
  }

  //GRANT ACCESS  TO PROTECTED DATA
  req.admin = freshAdmin;
  next();
};

//---------------------------withdrawn section---------------------------
exports.campaignWithdraw = async (req, res) => {
  const campaign = await Campaign.find({
    withdrawn: "true",
  });

  return res.status(200).json({
    status: "success",
    results: campaign.length,
    data: {
      campaign,
    },
  });
};

//-------------get campaign by id---------------
exports.getCampaignById = async (req, res) => {
  const campaign = await Campaign.findById(req.params.id);

  return res.status(200).json({
    status: "success",
    data: {
      campaign,
    },
  });
};

//-------------approves campaign--------------
exports.campaignApproves = async (req, res, next) => {
  const campaign = await Campaign.findById(req.params.id);

  const tempCampaign = {
    ...campaign,
  };

  if (!(tempCampaign["_doc"].campaignStatus = "FUNDING")) {
    tempCampaign["_doc"].campaignStatus = "FUNDING";
  }
  const updatedCampaign = await Campaign.findByIdAndUpdate(
    req.params.id,
    tempCampaign["_doc"]
  );

  if (updatedCampaign) {
    approveAlertEmail(campaign.contactEmail,campaign.campaignTitle,new Date())
    return res.redirect("/admin/adminPortal#media");
  } else {
    return res.status(404);
  }
};

//-------------ends campaign--------------
exports.campaignEnds = async (req, res) => {
  const campaign = await Campaign.findById(req.params.id);

  const tempCampaign = {
    ...campaign,
  };

  if (!(tempCampaign["_doc"].campaignStatus = "ENDED")) {
    tempCampaign["_doc"].campaignStatus = "ENDED";
  }
  const updatedCampaign = await Campaign.findByIdAndUpdate(
    req.params.id,
    tempCampaign["_doc"]
    );
    
    if (updatedCampaign) {
    declineAlertEmail(campaign.contactEmail,campaign.campaignTitle,new Date())

      return res.redirect("/admin/adminPortal#links");
  } else {
    return res.status(404);
  }
};

//--------------------funding completed and ended total amount collected--------------------
//general function to calculate the total amount of each campaignstatus
const calcTotalAmount =async (campaign)=>{
  console.log("working campaigns");
  
  let transactions=[];
  let transactionDetails=[];
  let campaignTransactionDetails=[];
  
  for(let i = 0; i < campaign.length; i++){
    transactions = await Transaction.find({
      campaign:campaign[i]._id
    });
    
    transactionDetails[i]=transactions;

    let donationSum=0;
    let donations=[]; 

    transactionDetails[i].forEach((el)=>{
      donations.push(el["amount"]);
    })
    
    donations.forEach((num)=>{
      donationSum+=num;
    });
    
    if(transactionDetails[i].length){      
      campaignTransactionDetails[i]={
        campaignID:campaign[i]._id,
        titleOfCampaign:campaign[i].campaignTitle,
        totalAmount:donationSum
      }
    }else{
      campaignTransactionDetails[i]={
        campaignID:campaign[i]._id,
        titleOfCampaign:campaign[i].campaignTitle,
        totalAmount:0
      }
    }
  }
  console.log(campaignTransactionDetails);
  return campaignTransactionDetails;
}


//------------------1.FUNIDNG-----------------------------
exports.fundingTotalCollection = async (req, res, next) => {
  const campaigns = await Campaign.find({
    campaignStatus:"FUNDING"
  });
  
  let campaignTransactionDetail =await calcTotalAmount(campaigns);
  
  return res.status(200).json({
    status: "success",
    campaignResult: campaigns.length,
    data: {
      campaignTransactionDetail,
    },
  });
};

//------------------2.COMPLETED-----------------------------
exports.completedTotalCollection = async (req, res, next) => {
  const campaigns = await Campaign.find({
    campaignStatus:"COMPLETE"
  });
  
  let campaignTransactionDetail =await calcTotalAmount(campaigns);
  
  return res.status(200).json({
    status: "success",
    campaignResult: campaigns.length,
    data: {
      campaignTransactionDetail,
    },
  });
};

//------------------2.ENDED-----------------------------
exports.endedTotalCollection = async (req, res, next) => {
  const campaigns = await Campaign.find({
    campaignStatus:"ENDED"
  });
  
  let campaignTransactionDetail =await calcTotalAmount(campaigns);
  console.log(campaigns);
  return res.status(200).json({
    status: "success",
    campaignResult: campaigns.length,
    data: {
      campaignTransactionDetail,
    },
  });
};


//-----------------------------Dashboard Information-----------------------
const totalRaised =async (campaign)=>{
  let transactions=[];
  let transactionDetails=[];
  
  let donationSum=0;
  for(let i = 0; i < campaign.length; i++){
    transactions = await Transaction.find({
      campaign:campaign[i]._id
    });
    
    transactionDetails[i]=transactions;
    
    let donations=[]; 
    
    transactionDetails[i].forEach((el)=>{
      donations.push(el["amount"]);
    })
    donations.forEach((num)=>{
      donationSum+=num;
    });
  }
  
  return donationSum;
}


const withdrawnAmount = (campaign)=>{
  let withdrawnSum=0;
  // console.log(campaign);
 
    let withdraws=[]; 

    campaign.forEach((el)=>{
      withdraws.push(el["withdrawnAmount"]);
    })

    withdraws.forEach((num)=>{
      withdrawnSum+=num;
    });

  return withdrawnSum;    
}

exports.dashboard = async (req,res)=>{
  const totalCampaigns = await Campaign.find();
  const withdrawnCampaigns = await Campaign.find({
    withdrawn:true
  });
  const activeCampaigns = await Campaign.find({
    campaignStatus:"FUNDING"
  });

  const unverifiedCampaigns = await Campaign.find({
    campaignStatus:"UNVERIFIED"
  });

  const completeCampaigns = await Campaign.find({
    campaignStatus:"COMPLETE"
  });
  const endedCampaigns = await Campaign.find({
    campaignStatus:"ENDED"
  });

  const nonProfitCampaign = await Campaign.find({
    campaignType:"Non-Profit"
  });

  const individualCampaign = await Campaign.find({
    campaignType:"Individual"
  });

   const activeCampaignsTotal=await totalRaised(activeCampaigns); 
   const completeCampaignsTotal=await totalRaised(completeCampaigns);
   const endedCampaignsTotal=await totalRaised(endedCampaigns);
   const nonProfitCampaignTotal=await totalRaised(nonProfitCampaign);
   const individualCampaignTotal=await totalRaised(individualCampaign);
   const withdrawnTotal= withdrawnAmount(withdrawnCampaigns); 

   const totalRaisedAmount=activeCampaignsTotal+completeCampaignsTotal+endedCampaignsTotal;

  return res.status(200).json({
    status:"success",
    results:totalCampaigns.length,
    data:{
      campaignStatics:{
      totalCampaign:totalCampaigns.length,
      unverifiedCampaigns:unverifiedCampaigns.length,
      activeCampaigns:activeCampaigns.length,
      completeCampaigns:completeCampaigns.length,
      endedCampaigns:endedCampaigns.length
      },
      revenueStatics:{
        totalRaised:totalRaisedAmount,
        nonProfitCampaignAmount:nonProfitCampaignTotal,
        individualCampaignAmount:individualCampaignTotal,
        commissionAmount:parseFloat((0.2*individualCampaignTotal).toFixed(2)),
        withdrawnAmount:withdrawnTotal
      }
    }
  });
}

//---------------Todays Stats------------------------
exports.todaysStats = async (req,res)=>{

  const campaign = await Campaign.find();

  const date = new Date();
  const currentYear = date.getFullYear();
  const currentMonth= date.getMonth();
  const currentDate = date.getDate();

  let newCampaignCount = 0;

   let campaignCreatedYear;
   let campaignCreatedMonth;
   let campaignCreatedDate;
   
const start = new Date(currentYear, currentMonth, currentDate);
const end = new Date(currentYear, currentMonth, currentDate+1);

console.log(start,end);
   const transaction = await Transaction.find({
         updatedAt:{
          $gte: startOfDay(start),
          $lte: endOfDay(end)
         }
   });

   //transaction sum
   let totalraisedToday=0;
   let individualToday=0;
   let campaignIdTransaction=[];
   let nonProfitAmount=0;
   
   console.log(transaction);
   
   campaign.forEach((el)=>{
     campaignCreatedYear=el.createdAt.getFullYear();
     campaignCreatedMonth=el.createdAt.getMonth()+1;
     campaignCreatedDate=el.createdAt.getDate();
     
  
     if(currentYear===campaignCreatedYear && currentMonth+1===campaignCreatedMonth && currentDate===campaignCreatedDate){
            //campaign created count today 
            newCampaignCount++;
     
          }
        });
        
        //1.total raised amount today
              
        transaction.forEach(async (el)=>{
          totalraisedToday+=el.amount;
      
          //1.1 get campaign ids
          campaignIdTransaction.push(el["campaign"]);
        });


        //here individualToday will be dudected later
        individualToday=totalraisedToday;
         nonProfitAmountToday=totalraisedToday;
        //1.loop through the transactionIDa and if the campaign of the transaction is not indivudal then deduct the sum from totalRaised that will be the individual amount 
        // console.log("campaignIdTransaction");  
        // console.log(campaignIdTransaction);

        for(let i=0;i<campaignIdTransaction.length;i++){
          const campaignTodayIndividual = await Campaign.find({
              _id:campaignIdTransaction[i]
          });

          if(campaignTodayIndividual[0].campaignType === "Non-Profit"){
            individualToday=individualToday-transaction[i].amount;
          }

          if(campaignTodayIndividual[0].campaignType === "Individual"){
            nonProfitAmountToday=nonProfitAmountToday-transaction[i].amount;
          }
        }
        
   return res.status(200).json({
    status:"success",
    data:{
       newCampaigns:newCampaignCount,
       totalRaised:totalraisedToday,
       individualAmount:individualToday,
       commissionAmount:parseFloat((0.2*individualToday).toFixed(3)),
       nonProfit:nonProfitAmountToday
    }
  });
}