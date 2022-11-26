const mongoose = require("mongoose");
const User = require('../models/userModel');

//TODO: this function will be at utils after testing and will be imported (Nikesh)
const optionalWidthLength = function (minLength, maxLength) {
  minLength = minLength || 0;
  maxLength = maxLength || Infinity;
  return {
    validator: function (value) {
      if (value === undefined) return true;
      return value.length >= minLength && value.length <= maxLength;
    },
    message:
      "Optional field is shorter than the minimum allowed length (" +
      minLength +
      ") or larger than the maximum allowed length (" +
      maxLength +
      ")",
  };
};

//campaing schema (defining model)
const campaignSchema = new mongoose.Schema({
  campaignTitle: {
    type: String,
    trim: true,
    required: [true, "A campaign must have a title"],
  },
  description: {
    type: String,
    trim: true,
    required: [true, "A campaign must have a description"],
    // descriptionLength: optionalWidthLength(40, 100),
  },
  campaignDuration: {
    type: Date,
    required: [true, "A campaign must have date"],
  },
  reasonBehindCampaign: {
    type: String,
    trim: true,
    required: [true, "A campaign must have a valid reason"],
    // reasonLength: optionalWidthLength(60, 200),
  },
  campaignAddress: {
    type: String,
    required: [true, "A campaign must have a valid address"],
  },
  campaignType: {
    type: String,
    required: [true, "A campaign must have a campaignType"],
    enum: ["Individual", "Non-Profit"],
  },
  goalAmount: {
    type: Number,
    default: 0,
    required: [true, "A campaign must have a goal amount"],
  },
  socialMediaLink: {
    type:String
  }
  ,
  contactEmail: {
    type: String,
    unique: false,
    required: [true, "A campaign must have unique email address"],
  },
  organizerName:{
    type: String,
    required: [true,"A campaign must have a organizer"]
  },
  campaignImage: {
    type: String,
    required: [true, "A camapign must have an image"],
  },
  contactNumber:{
    type:Number,
    minLength:10,
    maxLength:10
  },
  timeStamps: {
    type: Date,
    timestamps: true,
  },
  campaignStatus: {
    type: String,
    default: "UNVERIFIED",
    enum: ["UNVERIFIED", "FUNDING", "COMPLETE" ,"ENDED"],
  },  
  // createdAt: {
  //   type: Date,
  //   default: Date.now(),
  //   select: true,
  // },
  user:
   {
       type:mongoose.Schema.ObjectId,
       ref:'User',
       require:[true,"A Campaign must belong to a user"]
   },
   impressions:{
    type: Number,
    default:0
   },
   withdrawn:{
    type:Boolean,
    default:false
   },
   withdrawnAmount:{
    type:Number,
    default:0
   },
   
},
{
  timestamps: true,
});

//making a campaign model
const Campaign = mongoose.model("Campaign", campaignSchema);

module.exports = Campaign;
