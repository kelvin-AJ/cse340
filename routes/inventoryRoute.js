// Needed Resources
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const invController = require("../controllers/invController")
const invValidation = require("../utilities/inventory-validation")



// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
router.use("/detail/:inventoryId", invController.buildByInventoryId);

// Add Classification Router
router.use("/add-classification", utilities.handleErrors(invController.buildAddClasssificationView))

// Handle Add Classification Form
router.post("/submit-classification",
    // invValidation.registrationRules(), 
    // invValidation.checkClassificationName, 
    utilities.handleErrors(invController.addClassification))

// Build Management View
router.use("/", utilities.handleErrors(invController.buildManagementView))

module.exports = router;