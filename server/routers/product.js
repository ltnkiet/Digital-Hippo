const router = require("express").Router();
const productController = require("../controllers/product");
const { verifyAccessToken, isEmployee } = require("../middlewares/verifyToken");
const uploader = require("../config/cloudinary.config")

router.post("/", [verifyAccessToken, isEmployee], productController.createProduct);
router.get("/", productController.getProductList);
router.put("/rating", verifyAccessToken, productController.rating);

router.put("/uploadimage/:pid",[verifyAccessToken, isEmployee], uploader.array('images', 10),productController.uploadImgProduct);
router.put("/:pid",[verifyAccessToken, isEmployee],productController.updateProduct);
router.delete("/:pid", [verifyAccessToken, isEmployee],productController.deleteProduct);
router.get("/:pid", productController.getProduct);

module.exports = router;
