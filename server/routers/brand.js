const router = require("express").Router();
const brandController = require("../controllers/brand");
const { verifyAccessToken, isEmployee } = require("../middlewares/verifyToken");
const uploader = require("../config/cloudinary.config");

router.post(
  "/",
  [verifyAccessToken, isEmployee],
  uploader.fields([{ name: "thumb", maxCount: 1 }]),
  brandController.createBrand
);

router.get("/", brandController.getBrand);

router.put(
  "/:id",
  [verifyAccessToken, isEmployee],
  uploader.fields([{ name: "thumb", maxCount: 1 }]),
  brandController.updateBrand
);

router.delete(
  "/:id",
  [verifyAccessToken, isEmployee],
  brandController.deleteBrand
);

module.exports = router;
