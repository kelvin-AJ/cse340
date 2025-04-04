// Needed Resources
const express = require("express")
const utilities = require("../utilities")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')


// Default "/" route
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildManagement))

// Form Handling
router.post("/signup",
      regValidate.registrationRules(),
      regValidate.checkRegData,
      utilities.handleErrors(accountController.createAccount)
)

router.post(
      "/login",
      regValidate.loginRules(),
      regValidate.checkLoginData,
      utilities.handleErrors(accountController.accountLogin)
)

router.use("/login", utilities.handleErrors(accountController.buildLogin))
router.use("/signup", utilities.handleErrors(accountController.buildSignup))



module.exports = router