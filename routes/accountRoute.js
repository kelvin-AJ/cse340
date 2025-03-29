// Needed Resources
const express = require("express")
const utilities = require("../utilities")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')


router.use("/login", utilities.handleErrors(accountController.buildLogin))
router.use("/signup", utilities.handleErrors(accountController.buildSignup))

// Form Handling
router.post("/create-account",
      regValidate.registrationRules(),
      regValidate.checkRegData,
      utilities.handleErrors(accountController.createAccount)
)


module.exports = router