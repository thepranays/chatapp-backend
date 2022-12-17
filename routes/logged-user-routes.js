const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const loggedUserController = require("../controllers/logged-user-controller");

router.use(auth);
router.post("/find-user-by-id/", loggedUserController.findUserById);
router.post("/session/messages/", loggedUserController.getSessionMesssages);
router.get("/users/", loggedUserController.getAllUsers);

module.exports = router;