const express = require("express");
const router = express.Router();
const contentController = require("../../controllers/contentController");

router
  .get("/historical", contentController.spaceXHistory)
  .get("/recap_data", contentController.spaceXDashboard)
  .get("/launches", contentController.spaceXLaunches)
  .get("/starlinks", contentController.spaceXStarlinks)
  .get("/launches/upcoming", contentController.spaceXUpcoming);

module.exports = router;
