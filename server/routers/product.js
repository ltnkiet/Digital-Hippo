const router = require("express").Router();
const productController = require("../controllers/product");
const { verifyAccessToken, isEmployee } = require("../middlewares/verifyToken");
const uploader = require("../config/cloudinary.config");

router.post(
  "/",
  [verifyAccessToken, isEmployee],
  uploader.fields([
    { name: "images", maxCount: 10 },
    { name: "thumb", maxCount: 1 },
  ]),
  productController.createProduct
);
router.get("/", productController.getProductList);
router.put("/rating", verifyAccessToken, productController.rating);
router.get("/rating", [verifyAccessToken, isEmployee], productController.getAllRatings);
router.get("/category/:categoryName", productController.getProductByCategory);

router.put(
  "/upload/image/:pid",
  [verifyAccessToken, isEmployee],
  uploader.array("images", 10),
  productController.uploadImgProduct
);

router.put(
  "/:pid",
  [verifyAccessToken, isEmployee],
  productController.updateProduct
);
router.delete(
  "/:pid",
  [verifyAccessToken, isEmployee],
  productController.deleteProduct
);
router.get("/:pid", productController.getProductDetail);

router.put('/varriant/:pid', [verifyAccessToken, isEmployee], uploader.fields([
  { name: 'images', maxCount: 10 },
  { name: 'thumb', maxCount: 1 }
]), productController.addVarriant)

module.exports = router;
