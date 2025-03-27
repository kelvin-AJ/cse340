// Needed Resources
const express = require("express")
const utilities = require("../utilities")
const router = new express.Router()
const accountController = require("../controllers/accountController")


// Deliver Login View
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("./account/login", {
        title: "Login",
        nav,
    })
    console.log(req.url)
}
// Deliver register view
async function buildSignup(req, res, next) {
    console.log(req.url)
    let nav = await utilities.getNav()
    res.render("./account/signup", {
        title: "Sign Up",
        nav
    })
}

// Form Handling
router.post('/account/signup', utilities.handleErrors(accountController.createAccount))


module.exports = {buildLogin, buildSignup}