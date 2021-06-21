const express = require("express");
const namespaceController = require("./../controllers/namespaceController");

const router = express.Router();

router.route("/").get(namespaceController.getAllNamespaces);

router.route("/create-room").post(namespaceController.addRoomToNamespace);

router.route("/").post(namespaceController.createNamespace);

module.exports = router;
