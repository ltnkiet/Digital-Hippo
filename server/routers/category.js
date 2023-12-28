const router = require("express").Router();
const categoryController = require("../controllers/category");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const uploader = require("../config/cloudinary.config")

router.post("/", [verifyAccessToken, isAdmin], categoryController.createCategory)
router.get("/", categoryController.getCategory)

router.put("/upload/image/:cid", [verifyAccessToken, isAdmin], uploader.single('image'), categoryController.uploadImage);
router.put("/:cid", [verifyAccessToken, isAdmin], categoryController.updateCategory)
router.delete("/:cid", [verifyAccessToken, isAdmin], categoryController.deleteCategory)


module.exports = router;
