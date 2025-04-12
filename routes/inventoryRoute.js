// Needed Resources
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const invController = require("../controllers/invController")
const invValidation = require("../utilities/inventory-validation")




// Route to build inventory edit view 
router.get("/edit/:inventoryId", 
    utilities.verifyAccountType ,
    utilities.handleErrors(invController.buildEditInventoryView)
)
router.get("/delete/:inventoryId", 
    utilities.verifyAccountType ,
    utilities.handleErrors(invController.buildDeleteInventoryView)
)
router.get("/getInventory/:classificationId", 
    utilities.handleErrors(invController.getInventoryJSON))
router.post("/update/", 
    invValidation.inventoryCreationRules(),
    invValidation.checkInventoryCreationData,
    utilities.verifyAccountType ,
    utilities.handleErrors(invController.updateInventory)
)
router.post("/delete/",
    utilities.verifyAccountType ,
     utilities.handleErrors(invController.deleteInventory)
)
// Route to handle favorite updating form
router.post("/addToFavorite",
    utilities.handleErrors(invController.updateFavorite)
)


// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
router.use("/detail/:inventoryId", invController.buildByInventoryId);

// Handle Add Classification Form
router.post("/add-classification",
    utilities.verifyAccountType ,
    invValidation.classificationNamingRules(), 
    invValidation.checkClassificationName, 
    utilities.handleErrors(invController.addClassification))

// Handle Add Inventory Form
router.post("/add-inventory", 
    utilities.verifyAccountType ,
    invValidation.inventoryCreationRules(),
    invValidation.checkInventoryCreationData,
    utilities.handleErrors(invController.addInventory))



// Add Classification Router
router.use("/add-classification", 
    utilities.verifyAccountType ,
    utilities.handleErrors(invController.buildAddClasssificationView))
// Add Inventory Router
router.use("/add-inventory", 
    utilities.verifyAccountType ,
    utilities.handleErrors(invController.buildAddInventoryView))


// Build Management View
router.use("/",
    utilities.verifyAccountType ,
     utilities.handleErrors(invController.buildManagementView))

module.exports = router;