const Transaction = require('../models/transactionModel');
const axios = require("axios");

exports.khaltiPaymentVerification = (req, res) => {

  let data = {
    token: req.body.payload.token,
    amount: req.body.payload.amount,
  };

  let config = {
    headers: {
      Authorization: "Key " + process.env.KHALTI_SECRET_KEY,
    },
  };

  axios
    .post("https://khalti.com/api/v2/payment/verify/", data, config)
    .then(async (response) => {
      const {donarName,donarMessage,payload} = req.body;
      const {amount,created_on,product_identity} = response.data;
      
      //creating transaction in database
      const newTransaction = await Transaction.create({
        name:donarName,
        message:donarMessage,
        titleOfCampaign:payload.product_name,
        amount:amount/100 ,
        createdAt:created_on,
        user:req.user._id,
        campaign:product_identity
      })
  
      return res.send(response.data);
    })
    .catch((error) => {
      console.log(error);
      return res.send(error)
    });

};
