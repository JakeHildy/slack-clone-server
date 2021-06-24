const express = require("express");
const userController = require("../controllers/userController");
const jwt = require("jsonwebtoken");

const router = express.Router();

function getToken(req) {
  return req.headers.authorization.split(" ")[1];
}

const authorize = (req, res, next) => {
  const token = getToken(req);
  if (!token) return res.status(403).json({ error: "No token. Unauthorized." });
  if (jwt.verify(token, process.env.JWT_KEY)) {
    req.decode = jwt.decode(token);
    next();
  } else {
    res.status(403).json({ error: "Not Authorized." });
  }
};

router.route("/login").post(userController.loginUser);

router
  .route("/:id")
  .get(authorize, userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

router.route("/public/:id").get(userController.getUserPublicData);

router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);

module.exports = router;
