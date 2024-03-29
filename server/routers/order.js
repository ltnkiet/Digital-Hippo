const router = require("express").Router();
const orderController = require("../controllers/order");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post("/", verifyAccessToken, orderController.createOrderV2);
router.get("/", verifyAccessToken, orderController.getUserOrder);
router.get("/admin",[verifyAccessToken, isAdmin], orderController.getOrder);
router.put("/status/:oid", [verifyAccessToken, isAdmin], orderController.updateStatus);

  
module.exports = router;

