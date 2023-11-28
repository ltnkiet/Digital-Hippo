const router = require("express").Router();
const couponsController = require("../controllers/coupons");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post("/", [verifyAccessToken, isAdmin], couponsController.createCoupons)
router.put("/:cid", [verifyAccessToken, isAdmin], couponsController.updateCoupons)
router.delete("/:cid", [verifyAccessToken, isAdmin], couponsController.deleteCoupons)
router.get("/", couponsController.getCoupons)
 



module.exports = router;