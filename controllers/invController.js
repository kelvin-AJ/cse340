const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ********************************
* Build inventory by classification view
* ********************************* */

invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
    })
}

invCont.buildByInventoryId = async function (req, res, next) {
    const inventory_id = req.params.inventoryId
    console.log(inventory_id)
    const inventoryDetails = await invModel.getInventoryItemByInventoryId(inventory_id)
    const detail = await utilities.buildInventoryDetail(inventoryDetails)
    let nav = await utilities.getNav()
    res.render(`./inventory/detail`, {
        title: inventoryDetails.inv_make,
        nav,
        detail
    }) 
}

invCont.buildManagementView =  async function (req, res, next) {
    const nav = await utilities.getNav();
    const classificationList = await utilities.buildClassificationList()

    res.render("./inventory/management", {
        nav,
        classificationList,
        title : "Management", 
        error : null
    })
}


// MANAGEMENT VIEWs
invCont.buildAddClasssificationView = async function (req, res, next) {
    const nav = await utilities.getNav()
    
    res.render("inventory/addClassification", {
        nav,
        title: "New Classification",
        classification_name: null,
        errors : null 
    })
}

invCont.buildAddInventoryView = async function (req, res, next) {
    const nav = await utilities.getNav()
    const classificationList = await utilities.buildClassificationList()

    res.render("inventory/addInventory", {
        nav,
        title: "New Inventory",
        classificationList,
        errors : null 
    })
}

// CREATING CLASSIFICATION AND INVENTORY
invCont.addClassification = async function (req, res) {
    let nav = await utilities.getNav()
    const { classification_name } = req.body
    const creationResult = await invModel.createClassification(classification_name)
    
    if (creationResult) {
        req.flash("notice", `${classification_name} has been successfully created.`)
        res.status(201).render("inventory/management", {
            title: "Management",
            nav,
            errors: null,
        })
    } else {
        req.flash("notice", "Classification wasn't created.")
        req.status(501).render("inventory/addClassification", {
            nav,
            title: "New Classification",
            errors : null 
        })
    }
}


invCont.addInventory = async function (req, res) {
    let nav = await utilities.getNav()
    const {
        inv_make, 
        inv_model, 
        inv_year, 
        inv_description, 
        inv_image, 
        inv_thumbnail, 
        inv_price, 
        inv_miles,
        inv_color, 
        classification_id
    } = req.body

    const regResult = await invModel.createInventory(classification_id,
        inv_make, 
        inv_model, 
        inv_year, 
        inv_description, 
        inv_image, 
        inv_thumbnail, 
        inv_price, 
        inv_miles,
        inv_color)

    if (regResult) {
        req.flash("notice", `Congratulations, you have successfully registered ${inv_make} ${inv_model}.`)
        res.status(201).render("inventory/management", {
            title: "Management",
            nav,
            errors: null,
        })
    }
    else {
        req.flash("notice", "Sorry, the registration failed.")
        req.status(501).render("inventory/addInventory", {
            title: "New Inventory",
            nav,
            errors : null 
        })
    }
}

invCont.getInventoryJSON = async (req, res, next) => {
    const classification_id = parseInt(req.params.classificationId);
    const invData = await invModel.getInventoryByClassificationId(classification_id);
    if(invData[0].inv_id) {
     

        return res.json(invData)
    } else {
        next(new Error("No data returned"))
    }
}


// BUILDING EDIT INVENTORY VIEW
invCont.buildEditInventoryView = async function (req, res, next) {

    const inventory_id = parseInt(req.params.inventoryId);
    
    const nav = await utilities.getNav()
    const inventoryDetails = await invModel.getInventoryItemByInventoryId(inventory_id)
    const itemName = `${inventoryDetails.inv_make} ${inventoryDetails.inv_model}`
    const classificationList = await utilities.buildClassificationList(inventoryDetails.classification_id)

    res.render("./inventory/editInventory", {
        title: "Edit " + itemName,
        nav,
        classificationList: classificationList,
        errors: null,
        inv_id: inventoryDetails.inv_id,
        inv_make: inventoryDetails.inv_make,
        inv_model: inventoryDetails.inv_model,
        inv_year: inventoryDetails.inv_year,
        inv_description: inventoryDetails.inv_description,
        inv_image: inventoryDetails.inv_image,
        inv_thumbnail: inventoryDetails.inv_thumbnail,
        inv_price: inventoryDetails.inv_price,
        inv_miles: inventoryDetails.inv_miles,
        inv_color: inventoryDetails.inv_color,
        classification_id: inventoryDetails.classification_id
    })
}


/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
    let nav = await utilities.getNav()
    const {
      inv_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
    } = req.body

    const updateResult = await invModel.updateInventory(
      inv_id,  
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id
    )
  
    if (updateResult) {
      const itemName = `${updateResult.inv_make} ${updateResult.inv_model}`
      req.flash("notice", `The ${itemName} was successfully updated.`)
      res.redirect("/inv/")
    } else {
      const classificationList = await utilities.buildClassificationList(classification_id)
      const itemName = `${inv_make} ${inv_model}`
      req.flash("notice", "Sorry, the insert failed.")
      res.status(501).render("inventory/editInventory", {
      title: `Edit  ${itemName}`,
      nav,
      classificationList: classificationList,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
      })
    }
  }
/////////////////////////////////
// DELETE
/////////////////////////////////

// Deliver Delete Confirmation View
invCont.buildDeleteInventoryView = async function (req, res, next) {
    const inventory_id = parseInt(req.params.inventoryId);
    
    const nav = await utilities.getNav()
    const inventoryDetails = await invModel.getInventoryItemByInventoryId(inventory_id)
    const itemName = `${inventoryDetails.inv_make} ${inventoryDetails.inv_model}`

    res.render("./inventory/deleteConfirm", {
        title: "Delete " + itemName,
        nav,
        errors: null,
        inv_id: inventoryDetails.inv_id,
        inv_make: inventoryDetails.inv_make,
        inv_model: inventoryDetails.inv_model,
        inv_year: inventoryDetails.inv_year,
        inv_price: inventoryDetails.inv_price,
    })
}


/* ***************************
 *  Delete Vehicle (No turning back from this)
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
    let nav = await utilities.getNav()
    const {
      inv_id,
      inv_make,
      inv_model,
      inv_price,
      inv_year,
    } = req.body

    const updateResult = await invModel.deleteInventoryItem(inv_id)
  
    if (updateResult) {
      req.flash("notice", `The ${inv_make} ${inv_model} was successfully Deleted.`)
      res.redirect("/inv/")
    } else {

      const itemName = `${inv_make} ${inv_model}`
      req.flash("notice", `Sorry, ${inv_make} ${inv_model} failed to delete`)
      res.status(501).render("inventory/deleteInventory", {
      title: `Delete  ${itemName}`,
      nav,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_price
      })
    }
  }

module.exports = invCont
