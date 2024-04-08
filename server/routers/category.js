const router = require("express").Router();
const categoryController = require("../controllers/category");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const uploader = require("../config/cloudinary.config");

router.post(
  "/",
  [verifyAccessToken, isAdmin],
  uploader.fields([{ name: "thumb", maxCount: 1 }]),
  categoryController.createCategory
);

router.get("/", categoryController.getCategory);

router.put(
  "/:id",
  [verifyAccessToken, isAdmin],
  uploader.fields([{ name: "thumb", maxCount: 1 }]),
  categoryController.updateCategory
);

router.delete(
  "/:id",
  [verifyAccessToken, isAdmin],
  categoryController.deleteCategory
);

module.exports = router;
