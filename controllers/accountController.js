const utilities = require("../utilities")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config


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


// Process login request
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }

      return res.redirect("/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

// Build Account Management View
async function buildManagement(req, res) {
  const nav = await utilities.getNav()
  const accountData = await accountModel.getAccountById(res.locals.accountData.account_id)
    res.render("account/accountManagement", {
      nav,
      title: "Management",
      accountData,
      errors: null
    })
}


// Updating account and password
async function updateAccount(req, res) {
  const nav = await utilities.getNav()
  const {account_firstname, account_lastname, account_email, account_id} = req.body
  const accountData = await accountModel.getAccountById(res.locals.accountData.account_id)
  const updateResult = await accountModel.updateAccountInfo(account_firstname, account_lastname, account_email, account_id)

  if(updateResult) {
    req.flash("notice", "Account Information was successfully updated")
    res.redirect("/")
  } else {
    const accountData = await accountModel.getAccountById(res.locals.accountData.account_id)
    req.flash("notice", "Sorry, the update failed")
    res.status(501).render("account/accountManagement", {
      nav,
      title: "Management",
      accountData,
      errors: null
    })
  }
}

async function updatePassword(req, res) {
  const nav = await utilities.getNav()
     // Hash the password before storing
     const {account_password, account_id} = req.body

     const accountData = await accountModel.getAccountById(res.locals.accountData.account_id)
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error updating the password')
    res.status(500).render("account/accountManagement", {
      nav,
      title: "Management",
      accountData,
      errors: null
    })
  }

  const updateResult = await accountModel.updatePassword
  (hashedPassword, account_id)

  if(updateResult) {
    req.flash("notice", `Password updated successfully`)

    res.status(201).render("account/accountManagement", {
      nav,
      title: "Management",
      accountData,
      errors: null
    })
   } else {
      req.flash("notice", "Password update failed")
      req.status(501).render("account/accountManagement", {
        nav,
        title: "Management",
        accountData,
        errors: null
      })
    }
  
}

async function logout(req, res) {
  const nav = await utilities.getNav();
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true
    })

    req.flash("notice", "Logged out successfully")
    res.redirect("/")
}

module.exports = {buildLogin, buildSignup, createAccount, accountLogin, buildManagement, updateAccount, updatePassword, logout}
