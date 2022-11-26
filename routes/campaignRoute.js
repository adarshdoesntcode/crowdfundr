const express = require("express");
const authController = require("../controllers/authController");

//import campaignController as an object
const campaignController = require("../controllers/campaignController");
const paymentController = require("../controllers/paymentController");

const router = express.Router();

//isLoggedIn route
router.use(authController.isLoggedIn);

//View Routes
router.route("/").get(campaignController.homepageViewRoute);
router.get(
  "/campaignform",
  authController.protect,
  campaignController.campaignFormViewRoute
);
router.route("/login").get(campaignController.loginViewRoute);

router.route("/campaigns").get(campaignController.getAllCampaign);
router.route("/popularcampaigns").get(campaignController.getPopularCampaign);
router
  .route("/searchcampaigns/:keyword")
  .get(campaignController.getSearchCampaign);

router.route("/campaigns/:id").get(campaignController.getOneCampaign);
router.route("/explore").get(campaignController.explorePage);
router.route("/achievements").get(campaignController.achievements);

router
  .route("/campaigns")
  .post(authController.protect, campaignController.createCampaign);
router
  .route("/campaigns/:id")
  .patch(authController.protect, campaignController.endCampaign);

router
  .route("/campaign/donate")
  .post(authController.protect, paymentController.khaltiPaymentVerification);

module.exports = router;
