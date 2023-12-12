const router = require("express").Router();
const couponsController = require("../controllers/coupons");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post("/", [verifyAccessToken, isAdmin], couponsController.createCoupons)
router.get("/", couponsController.getCoupons)
router.put("/:cid", [verifyAccessToken, isAdmin], couponsController.updateCoupons)
router.delete("/:cid", [verifyAccessToken, isAdmin], couponsController.deleteCoupons)
 



module.exports = router;