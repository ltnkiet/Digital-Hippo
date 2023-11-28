const router = require("express").Router();
const brandController = require("../controllers/brand");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const uploader = require("../config/cloudinary.config")


router.post("/", [verifyAccessToken, isAdmin], brandController.createBrand)
router.get("/", brandController.getBrand)

router.put("/upload_img/:bid", [verifyAccessToken, isAdmin], uploader.single('image'), brandController.uploadImage);
router.put("/:cid", [verifyAccessToken, isAdmin], brandController.updateBrand)
router.delete("/:cid", [verifyAccessToken, isAdmin], brandController.deleteBrand)


module.exports = router;
