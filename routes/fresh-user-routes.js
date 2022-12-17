const express = require('express');
const { check } = require('express-validator');
const freshUserController = require("../controllers/fresh-user-controller");
const router = express.Router();


router.post("/login", freshUserController.isValidUser);
router.post("/sign-up", freshUserController.createUser);


module.exports = router;
