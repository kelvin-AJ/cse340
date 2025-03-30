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
// Add Inventory Router
router.use("/add-inventory", utilities.handleErrors(invController.buildAddInventoryView))

// Handle Add Classification Form
router.post("/submit-classification",
    invValidation.classificationNamingRules(), 
    invValidation.checkClassificationName, 
    utilities.handleErrors(invController.addClassification))

// Handle Add Inventory Form
router.post("/submit-inventory", 
    invValidation.inventoryCreationRules(),
    invValidation.checkInventoryCreationData,
    utilities.handleErrors(invController.addInventory))

// Build Management View
router.use("/", utilities.handleErrors(invController.buildManagementView))

module.exports = router;