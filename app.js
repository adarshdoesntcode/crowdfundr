const fs = require('fs');
const express = require("express");

const Campaign= require('./models/campaignModel');
// const globalErrorHandler = require('./Controllers/errorController');

var bodyParser = require("body-parser");
const path = require("path");
const app = express();
const hbs = require("hbs");
var cookieParser = require("cookie-parser");

//importing campaignRoute
const campaignRoute = require("./routes/campaignRoute");
const userRoute = require("./routes/userRoute");
const transactionRoute = require("./routes/transactionRoute");
const adminRoute = require("./routes/adminRoute");
//cookie parser
app.use(cookieParser());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//Define Paths for hbs :Adarsh
const publicDirectoryPath = path.join(__dirname, "/public");
const viewsDirectoryPath = path.join(__dirname, "/templates/views");
const navPartialPublic = fs.readFileSync(__dirname + '/templates/partials/public-nav.hbs','utf8');
const navPartialProtected = fs.readFileSync(__dirname + '/templates/partials/protected-nav.hbs','utf8');
const footerPartial = fs.readFileSync(__dirname + '/templates/partials/footer.hbs','utf8');


//Setup static directory :Adarsh
app.use(express.static(publicDirectoryPath));

//Setup  handlebar and views location and partials :Adarsh
app.set("view engine", "hbs");
app.set("views", viewsDirectoryPath);
hbs.registerPartial('public-nav',navPartialPublic);
hbs.registerPartial('protected-nav',navPartialProtected);
hbs.registerPartial('footer',footerPartial);



//-----------------Date checking middleware----------------
app.use(async (req, res, next) => {
   const campaign = await Campaign.find();

   //1.loop through all the campaign endDate and campare with the current date
   for(let i=0;i<campaign.length;i++){
    const campaignEndDate = campaign[i].campaignDuration.getTime();
    const currentTime = Date.now();
    const tempCampaign ={
        ...campaign[i]
    } 
    const campID=tempCampaign["_doc"]._id;

    //1.1.if current date exceed then set campaignStatus to Complete
    if(campaignEndDate<=currentTime){
        tempCampaign["_doc"].campaignStatus="COMPLETE";
    }
    
    // else{
    //     tempCampaign["_doc"].campaignStatus="FUNDING";
    // }
    
    //2.update the database with the new object
     const updateCampaign = await Campaign.findByIdAndUpdate(campID,tempCampaign._doc);
   }
    next()
  })

//Demo Route
app.use("", campaignRoute);
app.use("", transactionRoute);
app.use("/users", userRoute);
app.use("/admin",adminRoute);
// app.use(globalErrorHandler);


module.exports = app;
