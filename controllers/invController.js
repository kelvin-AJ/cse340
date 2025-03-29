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
    res.render("./inventory/management", {
        nav,
        title : "Management", 
        error : null
    })
}

invCont.buildAddClasssificationView = async function (req, res, next) {
    const nav = await utilities.getNav()
    
    res.render("inventory/addClassification", {
        nav,
        title: "New Classification",
        errors : null 
    })
}



// CREATING CLASSIFICATION AND INVENTORY
invCont.addClassification = async function (req, res) {
    let nav = await utilities.getNav()
    const { classification_name } = req.body
    console.log(classification_name)
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

module.exports = invCont
