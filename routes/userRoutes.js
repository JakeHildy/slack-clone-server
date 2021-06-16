const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

router.route("/:id").get(userController.getUser);

router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);

module.exports = router;
