const router = require("express").Router();
const insertController = require("../controllers/insert");

router.post("/", insertController.insertProduct)
router.post("/category", insertController.insertCategory)


module.exports = router;
