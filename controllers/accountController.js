const utilities = require("../utilities")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")


// Deliver Login View
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("./account/login", {
      title: "Login",
      nav,
      errors: null,
  })
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

// Process Registration
async function createAccount(req, res) {

    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body

    // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

    const regResult = await accountModel.createAccount(account_firstname, account_lastname, account_email, hashedPassword)

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
            errors: null
        })
    }
}


module.exports = {buildLogin, buildSignup, createAccount}
