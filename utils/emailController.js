const sgMail = require("@sendgrid/mail");

sgMail.setApiKey("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");

// const sendWelcomeEmail = (email, name) => {
//   sgMail.send({
//     to: email,
//     from: "crowdfundr@outlook.com",
//     subject: "Welcome to RentAWheel",
//     text: `Welcome ${name}. Hope you like our service.`,
//   });
// };

const sendWelcomeEmail = (
  email,
  name
) => {
  sgMail.send({
    to: email,
    from: 'crowdfundr@outlook.com',
    subject: "Welcome to CrowdFundr.",
    templateId: 'd-14bf5b014cd24580b43cedcd38de6635',
    dynamicTemplateData: {
      name
    }
  })

};


const adminAlertEmail = (
  email,    
  title,
  date,
  organizerName,
  contact
  )=>{
  
    let fdate = new Date(date)
  sgMail.send({
    to: email,
    from: 'crowdfundr@outlook.com',
    subject: "New Campaign Alert",
    templateId: 'd-6ebf30bb698d4b62986e3fa141cd2ae7',
    dynamicTemplateData: {
      title,
      date:fdate.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      organizerName,
      contact
    }
  })
}

const organizerAlertEmail = (
  email,    
  campaignName,
  date
  )=>{
  
  let fdate = new Date(date)
  sgMail.send({
    to: email,
    from: 'crowdfundr@outlook.com',
    subject: "Campaign Sent for Verification",
    templateId: 'd-fc576ccdb4e7439eb5cf3316ce765e5e',
    dynamicTemplateData: {
      campaignName,
      date:fdate.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      message:"Your campaign has been sent for Verification. You will be notified after the review is complete." ,
      status:"UNVERIFIED",
      emailTitle:"Campaign sent for Verification!",
      img:"https://png.pngtree.com/png-vector/20190425/ourlarge/pngtree-vector-tick-icon-png-image_991954.jpg"
    }
  })
}

const approveAlertEmail = (
  email,    
  campaignName,
  date
  )=>{
  
  let fdate = new Date(date)
  sgMail.send({
    to: email,
    from: 'crowdfundr@outlook.com',
    subject: "Campaign Approved",
    templateId: 'd-fc576ccdb4e7439eb5cf3316ce765e5e',
    dynamicTemplateData: {
      campaignName,
      date:fdate.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      message:"Your campaign has been approved. Your campaign is eligible to receive funds now." ,
      status:"FUNDING",
      emailTitle:"Your campaign has been Approved!",
      img:"https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Flat_tick_icon.svg/768px-Flat_tick_icon.svg.png"
    }
  })
}

const declineAlertEmail = (
  email,    
  campaignName,
  date
  )=>{
  
  let fdate = new Date(date)
  sgMail.send({
    to: email,
    from: 'crowdfundr@outlook.com',
    subject: "Campaign Declined!",
    templateId: 'd-fc576ccdb4e7439eb5cf3316ce765e5e',
    dynamicTemplateData: {
      campaignName,
      date:fdate.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      message:"Your campaign has been declined. Your campaign is not eligible for funding as per our guidelines." ,
      status:"ENDED",
      emailTitle:"Your campaign has been Declined!",
      img:"https://www.citypng.com/public/uploads/preview/free-red-x-close-mark-icon-sign-png-11639738559ozrdmkz71g.png"
    }
  })
}

const sendWithdrawEmail = (email, title,type,total,commission,withdrawn)=>{
  let fdate = new Date();
  
  sgMail.send({
    to: email,
    from: 'crowdfundr@outlook.com',
    subject: "Campaign Withdrawn!",
    templateId: 'd-2cf0052207984b109417463af14d2317',
    dynamicTemplateData: {
      campaignName:title,
      type,
      total,
      commission,
      withdrawn,
      date:fdate.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    }
  })
}

module.exports = {
  sendWelcomeEmail,
  adminAlertEmail,
  organizerAlertEmail,
  approveAlertEmail,
  declineAlertEmail,
  sendWithdrawEmail
};