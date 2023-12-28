const router = require("express").Router();
const brandController = require("../controllers/brand");
const { verifyAccessToken, isEmployee } = require("../middlewares/verifyToken");
const uploader = require("../config/cloudinary.config")


router.post("/", [verifyAccessToken, isEmployee], brandController.createBrand)
router.get("/", brandController.getBrand)

router.put("/upload/image/:bid", [verifyAccessToken, isEmployee], uploader.single('image'), brandController.uploadImage);
router.put("/:cid", [verifyAccessToken, isEmployee], brandController.updateBrand)
router.delete("/:cid", [verifyAccessToken, isEmployee], brandController.deleteBrand)


module.exports = router;
