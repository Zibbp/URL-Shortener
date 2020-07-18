const express = require("express");
const { resolve, createUrl } = require("../controllers/urls");

const router = express.Router();

router.route("/:slug").get(resolve);

router.route("/").post(createUrl);

module.exports = router;
