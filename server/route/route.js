const express = require("express");
const router = express.Router();
const nurseController = require("../controllers/nurseController");

router.post("/nurses", nurseController.addNurse);
router.get("/nurses", nurseController.getNurses);
router.put("/nurses/:id", nurseController.updateNurse);
router.delete("/nurses/:id", nurseController.deleteNurse);

module.exports = router;