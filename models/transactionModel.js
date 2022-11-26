const mongoose = require('mongoose');

const transactionschema = new mongoose.Schema({
name:{
    type:String,
    default:"Anonymous"
},
message:{
    type:String,
    default:"Donation"
},
amount:{
    type:Number,
    required:[true,"A transaction must have amount of donation"]
},
user:
    {
        type:mongoose.Schema.ObjectId,
        ref:'User',
        require:[true,"A Transaction must belong to a user"]
    },
    titleOfCampaign:{
        type:String,
    },
campaign:
    {
        type:mongoose.Schema.ObjectId,
        ref:'Campaign',
        require:[true,"A Transaction must belong to a Campaign"]
    }, 
//  createdAt: {
//     type: Date,
//     default: Date.now(),
//     select: true,
//   },
},  {
    timestamps: true,
  });

const Transaction = mongoose.model('Transaction',transactionschema);

module.exports = Transaction;