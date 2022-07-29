const express = require("express");
const router = express.Router();

const listController = require("../controller/listController")

const isAuth = require("../middleware/isAuth");

router.get("/", isAuth, listController.getLists);

module.exports = router;