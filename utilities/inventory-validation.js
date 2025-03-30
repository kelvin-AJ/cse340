const utilities = require(".")
const { body, validationResult } = require("express-validator")
const invValidate = {}



//  Inventory Data Validation Rules
invValidate.classificationNamingRules = () => {
        return [
            body('classification_name')
            .trim()
            .notEmpty()
            .matches(/^[a-zA-Z]+$/)
            .withMessage('Cannot contain a space or special character of any kind.')
        ]     
}

invValidate.inventoryCreationRules = () => { 
        return [
            // Classification
            body('classification_id')
            .notEmpty()
            .withMessage('Please select a classification.'),

            // Make
            body('inv_make')
            .trim()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage('Please provide a make.'),

            //Model
            body('inv_model')
            .trim()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage('Please provide a model.'),
            
            // Year
            body('inv_year')
            .trim()
            .notEmpty()
            .isNumeric()
            .isLength({ min: 4, max: 4 })
            .withMessage('Please provide a valid year.'),

            // Description
            body('inv_description')
            .trim()
            .notEmpty()
            .isLength({ min: 10 })
            .withMessage('Please provide a description.'),

            // Image Path
            body('inv_image')
            .trim()
            .notEmpty()
            .isLength({min:1})
            .withMessage('Please provide an image path.'),


            // Thumbnail Path
            body('inv_thumbnail')
            .trim()
            .notEmpty()
            .isLength({min:1})
            .withMessage('Please provide a thumbnail path.'),

            // Prine
            body('inv_price')
            .trim()
            .notEmpty()
            .isLength({ min: 1 })
            .isNumeric()
            .withMessage('Please provide a price.'),

            // Milage
            body('inv_miles')
            .trim()
            .notEmpty()
            .isNumeric()
            .withMessage('Please provide a mileage.'),

            body('inv_color')
            .trim()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage('Please provide a color.'),
        ]
}


// classification Creation Validation
invValidate.checkClassificationName = async (req , res , next) => {
    let errors = [].
    errors = validationResult(req)
        if (!errors.isEmpty()) {
            let nav = await utilities.getNav()
            res.render("inventory/management", {
                title: "Management",
                nav,
                errors
            })
            return
    }
    next()
}

// Inventory Creation Validation
invValidate.checkInventoryCreationData = async (req, res, next) => {
    const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body
    let errors = []
    errors = validationResult(req)
        if (!errors.isEmpty()) {
            let nav = await utilities.getNav()
            const classificationList = await utilities.buildClassificationList()
            res.render("inventory/addInventory", {
                title: "New Inventory",
                nav,
                classificationList,
                inv_make,
                inv_model,
                inv_year,
                inv_description,
                inv_image,
                inv_thumbnail,
                inv_price,
                inv_miles,
                inv_color,
                errors
            })
            return
        }
        next()
}

module.exports = invValidate