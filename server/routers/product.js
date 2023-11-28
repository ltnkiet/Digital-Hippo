const router = require("express").Router();
const productController = require("../controllers/product");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const uploader = require("../config/cloudinary.config")

router.post("/", [verifyAccessToken, isAdmin], productController.createProduct);
router.get("/", productController.getProductList);
router.put("/rating", verifyAccessToken, productController.rating);

router.put("/uploadimage/:pid",[verifyAccessToken, isAdmin], uploader.array('images', 10),productController.uploadImgProduct);
router.put("/:pid",[verifyAccessToken, isAdmin],productController.updateProduct);
router.delete("/:pid", [verifyAccessToken, isAdmin],productController.deleteProduct);
router.get("/:pid", productController.getProduct);

module.exports = router;
