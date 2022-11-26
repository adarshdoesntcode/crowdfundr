const Campaign = require("../models/campaignModel");
const Transaction = require("../models/transactionModel");
const Admin= require('../models/adminModel');
const {
  adminAlertEmail,organizerAlertEmail
} = require("../utils/emailController");


//Views Routes
exports.homepageViewRoute = async (req, res) => {
  res.render("index");
};

exports.campaignFormViewRoute = async (req, res) => {
  res.render("campaignForm");
};

exports.loginViewRoute = async (req, res) => {
  res.render("login");
};

exports.explorePage = async (req, res) => {

  const flag = req.query.checked;
  let config ={
    popular : "checked",
    all : "",

  };

  if(flag == "popular"){
    config = {
      popular : "checked",
      all : "",

    };
    return res.render("explore" , config);
  } 

  if(flag == "all"){
    config = {
      popular : "",
      all : "checked",

    };

    return res.render("explore" , config);
  }


  res.render("explore",config);
};

//Data Routes

//----------GET ALL CAMPAGINS---------------
exports.getAllCampaign = async (req, res) => {

  const campaign = await Campaign.find({
    campaignStatus:"FUNDING"
  }).sort({createdAt:-1});

  let transaction = [];

  let campaignWithTransaction = []; 

  for (let i = 0; i < campaign.length; i++){
     transaction = await Transaction.find({
      campaign:campaign[i]._id
    })

    let donations = [];
    transaction.forEach((transac)=>{
      donations.push(transac)
    })

     campaignWithTransaction[i]= {
      campaign: campaign[i],
      donations
     }
  };
  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    results: campaign.length,
    data: {
      campaigns:campaignWithTransaction
    },
  });
};

//----------GET POPULAR CAMPAGINS---------------
exports.getPopularCampaign = async (req, res) => {
  const campaign = await Campaign.find({campaignStatus:"FUNDING"}).sort({impressions:-1}).limit(parseInt(req.query.limit));

  let transaction = [];

  let campaignWithTransaction = []; 

  for (let i = 0; i < campaign.length; i++){
     transaction = await Transaction.find({
      campaign:campaign[i]._id
    })
 
    let donations = [];
    transaction.forEach((transac)=>{
      donations.push(transac)
    })

     campaignWithTransaction[i]= {
      campaign: campaign[i],
      donations
     }
  };
  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    results: campaign.length,
    data: {
      campaigns:campaignWithTransaction
    },
  });
};

//----------GET SEARCH CAMPAGINS---------------
exports.getSearchCampaign = async (req, res) => {
  const keyword = req.params.keyword.toUpperCase();
  let campaign =[];
  let campaigns = await Campaign.find({
    campaignStatus:"FUNDING"
  });

  for(let i= 0; i< campaigns.length; i++){
         if(campaigns[i].campaignTitle.toUpperCase().includes(keyword)){
          campaign.push(campaigns[i]);
   }
  }

  let transaction = [];

  let campaignWithTransaction = []; 
  if(campaign){
    for (let i = 0; i < campaign.length; i++){
       transaction = await Transaction.find({
        campaign:campaign[i]._id
      })
  
      let donations = [];
      transaction.forEach((transac)=>{
        donations.push(transac)
      })
  
       campaignWithTransaction[i]= {
        campaign: campaign[i],
        donations
       }
    };
  }


  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    results: campaign.length,
    data: {
      campaigns:campaignWithTransaction
    },
  });
};

// ----------GET ONE CAMPAIGN BY ID--------------

exports.getOneCampaign = async (req, res) => {


  const campaign = await Campaign.findById(req.params.id);
  const donations = await Transaction.find({
    campaign: campaign._id
  })
  if(campaign){
    let res = await Campaign.findByIdAndUpdate(campaign._id , {$inc:{ impressions: 1}})
  }


  const getDateDifference = (endDate) => {
    const end = new Date(endDate);
    const today = new Date();
    // console.log(end, today , end.getTi() - today.getDate());
    const diffTime =  end.getTime() - today.getTime();
  
    if((Math.ceil(diffTime / (1000 * 3600 * 24))) <= 0 ){
      return 0
    }
    else{
      return  Math.ceil(diffTime / (1000 * 3600 * 24));
    }
  };

  let percentForBar = Math.round(donations.reduce(function(sum, current) {
    return sum + current.amount;
  }, 0)/(campaign.goalAmount)*100) <= 100 ? Math.round(donations.reduce(function(sum, current) {
    return sum + current.amount;
  }, 0)/(campaign.goalAmount)*100) : 100 ;


  //SEND RESPONSE
  if(campaign){
    res.render('campaignPage',
    {
      status: "success",
      requestedAt: req.requestTime,
      results: campaign.length,
      title:campaign.campaignTitle,
      image:campaign.campaignImage,
      description:campaign.description,
      type: campaign.campaignType,
      address: campaign.campaignAddress,
      id:campaign._id,
      backers:donations.length,
      raised:donations.reduce(function(sum, current) {
        return sum + current.amount;
      }, 0).toLocaleString("hi-IN"),
      percentage:Math.round(donations.reduce(function(sum, current) {
        return sum + current.amount;
      }, 0)/(campaign.goalAmount)*100),
      goal: campaign.goalAmount.toLocaleString("hi-IN"),
      percentForBar,
      daysLeft: getDateDifference(campaign.campaignDuration),
      story: campaign.reasonBehindCampaign,
      campaignStatus: campaign.campaignStatus,
      organizerName: campaign.organizerName,
      createdDate : campaign.createdAt.toLocaleDateString( undefined,{year: 'numeric', month: 'long', day: 'numeric' })
    })
  }else{
    res.status(404).json({
      status: "fail",
      data: {
        message: "No campaigns found",
      },
    });
  }
  
};

//----------CREATE CAMPAIGN----------------
exports.createCampaign = async (req, res) => {

  try {

    const formData = {
      ...req.body,
      user: req.user._id,
    }
    // console.log(formData);
    // console.log('-----------req.body--------');
    // req.body['user']=req.user._id;
    // console.log(req.body);
    const newCampaign = await Campaign.create(formData);

    
    // const newCampaign = await Campaign.create(req.body);
    // console.log('-----new created campaign info------');
    // console.log(newCampaign);

    // console.log('-----req.user------');
    // console.log(req.user);
    let admins = await Admin.find();

    let adminEmails = admins.map((admin)=>{
      return admin.email
    })

    adminAlertEmail(adminEmails,formData.campaignTitle,newCampaign.createdAt,formData.organizerName,formData.contactNumber);
    organizerAlertEmail(req.body.contactEmail,formData.campaignTitle,newCampaign.createdAt);

    return res.status(201).json({
      status: "success",
      data: {
        campaign: newCampaign,
      },
    });




  } catch (err) {
    res.status(400).json({
      status: "fail",
      data: {
        message: err.message,
      },
    });
  }
};

//---------------END CAMPAIGN-----------------
exports.endCampaign = async (req, res) => {
  //ending the campaign based on the campaign id

  const checkcampaign = await Campaign.findById(req.params.id);

  if(checkcampaign.campaignStatus === "COMPLETE" || checkcampaign.campaignStatus === "ENDED"){
    return res.status(200).json({
      status: "fail",
      data: {
        message: "Campaign has already been stopped!!",
      },
    });
  }else{
    const campaign = await Campaign.findByIdAndUpdate(req.params.id,{
    campaignStatus : "ENDED",
  });
  }


  // console.log(campaign);

  res.status(200).json({
    status: "success",
    data: {
      campaign: null,
    },
  });
};

exports.achievements = async(req,res)=>{
  const campaign = await Campaign.find();
  const transaction = await Transaction.find();

  const campaignsBacked = campaign.length;
  const peopleContributed = transaction.length;

  let totalSum = 0 
  transaction.forEach((transac)=>{
    totalSum+=transac.amount

  })

  res.status(200).json({
    status: "success",
    data: {
      campaignsBacked,
      totalSum,
      peopleContributed
    },
  });
}


