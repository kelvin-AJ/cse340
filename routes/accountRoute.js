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
        errors: null,
    })
    console.log(req.url)
}
// Deliver register view
async function buildSignup(req, res, next) {
    console.log(req.url)
    let nav = await utilities.getNav()
    res.render("./account/signup", {
        title: "Sign Up",
        nav,
        errors: null,
    })
}

// Form Handling
async function createAccount(req, res, next) {
    // Reaches out to controller for help
    accountController.createAccount(req,res)
}


module.exports = {buildLogin, buildSignup, createAccount}