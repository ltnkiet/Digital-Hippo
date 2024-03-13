const router = require("express").Router();
const userController = require("../controllers/user");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const uploader = require("../config/cloudinary.config")

// Auth
router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/refreshtoken", userController.refreshAccessToken);
router.get("/logout", userController.logout);
router.post("/password/forgot", userController.forgotPassword);
router.put("/password/reset", userController.resetPassword);
router.get("/register/verify/:token", userController.emailVerify);
// CRUD CURRENT
router.get("/current", verifyAccessToken, userController.getCurrent);
router.put("/current", [verifyAccessToken], uploader.single("avatar"), userController.updateUser);
router.put("/address", [verifyAccessToken],userController.updateAddressUser);
// PRODUCT CART
router.put("/cart", [verifyAccessToken],userController.updateCart);
router.delete("/cart/remove/:pid/:color",[verifyAccessToken], userController.removeProductInCart)
router.put("/wishlist/:pid", [verifyAccessToken], userController.updateWishlist)
// CRUD USER BY ADMIN
router.get("/", [verifyAccessToken, isAdmin], userController.getUsers);
router.post("/mocks", [verifyAccessToken, isAdmin], userController.createUsers);
router.delete("/", [verifyAccessToken, isAdmin], userController.deleteUser);
router.put("/admin/update/:uid", [verifyAccessToken, isAdmin],userController.updateUserByAdmin);

module.exports = router;
