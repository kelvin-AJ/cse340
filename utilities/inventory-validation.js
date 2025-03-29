const utilities = require(".")
const { body, validationResult } = require("express-validator")
const invValidate = {}



//  Inventory Data Validation Rules

  invValidate.registrationRules = () => {
        return [
            body('classification_name')
            .trim()
            .notEmpty()
            .matches(/^[a-zA-Z]+$/)
            .withMessage('Cannot contain a space or special character of any kind.')
        ]
        
}

invValidate.checkClassificationName = async (req , res , next) => {
    console.log(errors)
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

module.exports = invValidate