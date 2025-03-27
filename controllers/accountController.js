const utilities = require("../utilities")
const accountModel = require("../models/account-model")


// const accountController = {createAccount}
// Process Registration

async function createAccount(req, res) {
    console.log("Hello from createAccount")

    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body


    const regResult = await accountModel.createAccount(account_firstname, account_lastname, account_email, account_password)
    console.log(regResult)

    if (regResult) {
        req.flash("notice", `Congratulations, you have successfully registered as ${account_firstname} ${account_lastname}. Please Login.`)


        res.status(201).render("account/login", {
            title: "Login",
            nav,
        })
    }   else {
        req.flash("notice", "Sorry, the registration failed.")
        req.status(501).render("account/signup", {
            title: "Sign Up",
            nav,
        })
    }
}

module.exports = {createAccount}
