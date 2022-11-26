const Transaction = require('../models/transactionModel');
const Campaign = require('../models/campaignModel');
const {
    sendWithdrawEmail
  } = require("../utils/emailController");

exports.getTransactionDetails = async(req,res)=>{

    const userTransactionDetails = await Transaction.find({
        user:req.user._id
    }).sort({
        createdAt:-1
    });

    let userTransactionDetailsWithTitle = [];

    console.log(userTransactionDetailsWithTitle);
    for(let i = 0 ; i < userTransactionDetails.length ; i++){
        const campaign = await Campaign.findById(userTransactionDetails[i].campaign);

        //added if clause for the campagin with no transaction it will give us null which will give us an error so it will prevent us from the error and also let carry out the withdrawn amount 
        if(campaign!==null){
            userTransactionDetailsWithTitle.push({
                transaction: userTransactionDetails[i],
                title: campaign.campaignTitle
            })
        }
    }


    return res.status(200).json({
        status:"success",
        results:userTransactionDetailsWithTitle.length,
        data:{
            userTransactionDetailsWithTitle
        }
    });
}

exports.getTransactionDetailsByCampaignID = async(req,res)=>{

    const transaction = await Transaction.find({
        campaign:req.params.id
    }).sort({createdAt:-1});
    

    return res.status(200).json({
        status:"success",
        results:transaction.length,
        data:{
            transaction
        }
    });
}

exports.campaignTransaction = async(req,res)=>{
    // console.log('------------------campaignTransaction section-------------------------');
  //1.get campaign created by user
  const campaigns= await Campaign.find({
    user:req.user.id
  }).sort({
    createdAt:-1
  });



  //2 get transaction associated with the created campaigns
   let transactions=[];
   let transactionDetails=[];
   let campaignTransactionDetails=[]
    for(let i = 0; i < campaigns.length ; i++){
        
        transactions = await Transaction.find({
            campaign:campaigns[i]._id
        });
        transactionDetails[i]=transactions;

        let donations=[];
        transactions.forEach((el)=>{
           donations.push(el["amount"]);
        })
        campaignTransactionDetails[i]={
                campaign: campaigns[i],
                donations
        }
    }
   
  //3.get the amount donated at the campaigns

    return res.status(200).json({
        status: "success",
        requestedAt: req.requestTime,
        results: campaigns.length,
        data:{
            campaignDetails:campaignTransactionDetails,
        }
    });
}


//-------------------Profile route----------------------------
exports.getProfileDetails = async (req,res)=>{
//1. get all campaigns and get donation of each campaign
const campaigns= await Campaign.find({
    // campaignStatus:"FUNDING",
    user:req.user.id
  });

//   console.log(campaigns);

  //2 get transaction associated with the created campaigns
     let transactions=[];
     let transactionDetails=[];
     let campaignTransactionDetails=[];
     let donations=[];
     let donationSum=0;
     let withdrawnSum = 0;
     let withdrawnCampaign = [];
    for(let i = 0; i < campaigns.length ; i++){
        transactions = await Transaction.find({
            campaign:campaigns[i]._id
        });

        //WITHDRAWN

        if(campaigns[i].withdrawn){
            withdrawnSum += campaigns[i].withdrawnAmount
        }


        transactionDetails[i]=transactions;

        transactions.forEach((el)=>{
           donations.push(el["amount"]);
        })
    }
    
    // console.log(donations);
    // 2.sum the donation of all campaign created by user
    donations.forEach((num)=>{
        donationSum+=num;
        // console.log(donationSum);
   });

    campaignTransactionDetails={
              donations,
              donationSum
           }
       
       
               let individualDonation=[];
               let individualDonationSum=0;
               //3.select individual campaign from all campaigns and cut total donation amount 
               const campaignIndividual= await Campaign.find({
            user:req.user.id,
            campaignType:"Individual"
          });
          //3.1 get the id of the individual campaign
          const individualCampaignId=[];
          campaignIndividual.forEach((el)=>{
                individualCampaignId.push(el["_id"]);
              });
          
         for(let i =0;i<individualCampaignId.length;i++){
             const transactionIndividual= await Transaction.find({
                 campaign:individualCampaignId[i]._id
             });
             
             transactionIndividual.forEach((el)=>{
                individualDonation.push(el["amount"]);
            })
        } 
        //3.2 get all the transaction/donationa and cut 20%
        //2.sum the donation of all campaign created by user
        individualDonation.forEach((num)=>{
            individualDonationSum+=num;
        });
        //4.cut of the 20% from total sum collected from individual campaign
        const hostCut = (0.2*individualDonationSum);

        //5.available balance
        const availableBalance = donationSum - hostCut;


        

        //7.send response 
        return res.status(200).json({
            status:"success",
            CampaignResult:campaigns.length,
            requestedAt:req.requestTime,
            data:{
                name:req.user.name,
                email:req.user.email,
                campaignTransactionDetails,
                amountCollectedFromIndividualCampaign:individualDonationSum,
                ChargeFromIndiviualCampaign:hostCut.toFixed(2),
                availableBalance:(availableBalance-withdrawnSum).toFixed(2),
                withdrawnSum
            }
        });
}

exports.campaignWithdraw = async(req, res)=>{
    
    const data = req.body.withdrawn;
    const raised = req.body.total;
    const commission = req.body.commission;


    const campaign = await Campaign.findByIdAndUpdate(req.params.id,{
        withdrawn:true,
        withdrawnAmount:data
    });

    sendWithdrawEmail(campaign.contactEmail,campaign.campaignTitle,campaign.campaignType,raised,commission,data);

    return res.status(200).json({
        status: "success",
        data:{
            campaign
        }
    });
}