const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const transactionController = require("../controllers/transactionController");

//Analogy can be : think as chaining method
const router = express.Router();

//get all transaction of the user
// router.route('/transactionsDetails').get(authController.protect,transactionController.getTransactionDetails);
router
  .route("/campaignDetails")
  .get(authController.protect, transactionController.campaignTransaction);
router
  .route("/profileDetails")
  .get(authController.protect, transactionController.getProfileDetails);

router
  .route("/profile")
  .get(authController.protect, userController.profilePage);

router.route("/signup").post(authController.signup);
router.route("/login").post(authController.login);
router.route("/logout").get(authController.logout);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
