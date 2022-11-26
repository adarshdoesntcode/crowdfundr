const express = require("express");
const adminController = require("../controllers/adminContoller");

//Analogy can be : think as chaining method
const router = express.Router();

router.route("/loginPage").get(adminController.adminLoginPage);
router
.route("/adminPortal")
  .get(adminController.protect, adminController.adminPortal);
  
  // router.route("/signup").post(adminController.signup);
  router.route("/login").post(adminController.login);
  router.route("/logout").get(adminController.protect ,adminController.logout);
  
  //route for unverfiedcampaign
  // router.route("/campaignVerification").get(adminController.protect,adminController.verfiyCampaign);
  router
  .route("/unverifiedCampaigns")
  .get(adminController.protect, adminController.unverifiedCampaigns);
  

  //route for---------------------campagin transactions------------------
  router
  .route("/campaignsTransactions")
  .get(adminController.protect, adminController.campaignsTransactions);
  
  //---------------route for dashboard---------------------------------------
  router.route("/adminPortal/dashboard").get(adminController.protect,adminController.dashboard);
  router.route("/adminPortal/todaysStats").get(adminController.protect,adminController.todaysStats);

  //-----------------route for totel collection of the campaign at different stages
  router.route("/adminPortal/fundingCollection").get(adminController.protect, adminController.fundingTotalCollection);
  router.route("/adminPortal/completedCollection").get(adminController.protect, adminController.completedTotalCollection);
  router.route("/adminPortal/endedCollection").get(adminController.protect,adminController.endedTotalCollection);


  router
  .route("/campaignWithdraw")
  .get(adminController.protect, adminController.campaignWithdraw);


router
.route("/adminPortal/:id")
.get(adminController.protect, adminController.getCampaignById);


//route that approves and end the campaign
router
.route("/adminPortal/campaignApproves/:id")
.get(adminController.protect, adminController.campaignApproves);


router
  .route("/adminPortal/campaignEnds/:id")
  .get(adminController.protect, adminController.campaignEnds);

  
  
  module.exports = router;
