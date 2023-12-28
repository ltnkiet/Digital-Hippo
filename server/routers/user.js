const router = require("express").Router();
const userController = require("../controllers/user");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post("/register", userController.register);
router.get("/register/email/verify/:token", userController.emailVerify);
router.get("/login", userController.login);
router.post("/refreshtoken", userController.refreshAccessToken);
router.get("/logout", userController.logout);
router.get("/password/forgot", userController.forgotPassword);
router.put("/password/reset", userController.resetPassword);
router.get("/current", verifyAccessToken, userController.getCurrent);
router.get("/", [verifyAccessToken, isAdmin], userController.getUser);
router.delete("/", [verifyAccessToken, isAdmin], userController.deleteUser);
router.put("/current", [verifyAccessToken], userController.updateUser);
router.put("/address", [verifyAccessToken],userController.updateAddressUser);
router.put("/cart", [verifyAccessToken],userController.updateCart);
router.put("/:uid", [verifyAccessToken, isAdmin],userController.updateUserByAdmin);


module.exports = router;
