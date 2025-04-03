// Needed Resources
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const invController = require("../controllers/invController")
const invValidation = require("../utilities/inventory-validation")



// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
router.use("/detail/:inventoryId", invController.buildByInventoryId);

// Handle Add Classification Form
router.post("/add-classification",
    invValidation.classificationNamingRules(), 
    invValidation.checkClassificationName, 
    utilities.handleErrors(invController.addClassification))

// Handle Add Inventory Form
router.post("/add-inventory", 
    invValidation.inventoryCreationRules(),
    invValidation.checkInventoryCreationData,
    utilities.handleErrors(invController.addInventory))


// Add Classification Router
router.use("/add-classification", utilities.handleErrors(invController.buildAddClasssificationView))
// Add Inventory Router
router.use("/add-inventory", utilities.handleErrors(invController.buildAddInventoryView))


// Build Management View
router.use("/", utilities.handleErrors(invController.buildManagementView))

module.exports = router;