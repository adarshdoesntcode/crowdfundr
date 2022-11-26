const express = require("express");
const authController = require("../controllers/authController");
const transactionController = require("../controllers/transactionController");

//Analogy can be : think as chaining method
const router = express.Router();

router
  .route("/transactionsDetails")
  .get(authController.protect, transactionController.getTransactionDetails);
router
  .route("/transactions/:id")
  .get(transactionController.getTransactionDetailsByCampaignID);
router
  .route("/profileCampaigns")
  .get(authController.protect, transactionController.campaignTransaction);
router
  .route("/withdraw/:id")
  .post(authController.protect, transactionController.campaignWithdraw);

module.exports = router;
