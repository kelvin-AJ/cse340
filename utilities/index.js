const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications()
    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => {
        list += `<li>
                    <a href="/inv/type/${row.classification_id}" title="See our inventory of ${row.classification_name} vehicles">${row.classification_name}</a>
                </li>`
    })
    list += "</ul>"
    
    return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
    // let grid
    if(data.length > 0){
      grid = '<ul id="inv-display">'
      data.forEach(vehicle => { 
        grid += `<li class="${vehicle.favourite ? "fav-inv" : ""}">`
        grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
        + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
        + 'details"><img src="' + vehicle.inv_thumbnail 
        +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
        +' on CSE Motors" /></a>'
        grid += '<div class="namePrice">'
        grid += '<hr />'
        grid += '<h2>'
        grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
        grid += '</h2>'
        grid += '<span>$' 
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
        grid += '</div>'
        grid += '</li>'
      })
      grid += '</ul>'
    } else { 
      grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
  }

// Build Inventory Detail
Util.buildInventoryDetail = async function(vehicle) {
  const vehicleObj = await vehicle
  const vehicleDetailHTML = `
    <div class="details-view">
			<div class="img-container">
				<img src="${vehicleObj.inv_image}" alt="Image of ${vehicleObj.inv_make} ${vehicleObj.inv_model}">
			</div>
			<div class="details-main">
				<div>
          <span>${vehicleObj.inv_make} </span> <span>${vehicleObj.inv_model}</span>
        </div>
				<span class="inventory-detail-description">${vehicleObj.inv_description}</span>
				<span class="inventory-detail-price">$${parseInt(vehicleObj.inv_price).toLocaleString('en-US')}</span>
				<span class="inventory-detail-mileage">Milage: ${parseInt(vehicleObj.inv_miles).toLocaleString('en-US')}</span>
				<span class="inventory-detail-color">Color: ${vehicleObj.inv_color}</span>
        <form method="POST" action="/inv/addToFavorite">
          <input type="hidden" value=${vehicleObj.inv_id} name="inv_id" id="inv_id">
          <button class="favorite-button" type="submit">
           ${vehicleObj.favourite? "Remove from Loved" : "Add to Loved"} <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M200-120v-640q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v640L480-240 200-120Zm80-122 200-86 200 86v-518H280v518Zm0-518h400-400Z"></path></svg>
            
          </button>
      </form>
			</div>
      
		</div>`


  return vehicleDetailHTML
}


Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}

// GET Witty message for 404 Page
Util.getWittyMessage = () =>{
  const funnyErrorMessages = [
    ["Out of Gas!", "Uh-oh, this page ran out of fuel. Ready to refuel at the home page?"],
    ["Wrong Turn!", "Looks like you took the scenic route to nowhere. Let’s head back to the dealership!"],
    ["Engine Stalled!", "The page you’re looking for didn’t pass inspection. Let’s tow you back to safety."],
    ["Flat Tire!", "This page hit a bump and couldn’t make it. Time to change direction!"],
    ["Road Closed!", "Construction ahead! This page isn’t ready yet. Let’s detour to somewhere better."],
    ["GPS Signal Lost!", "We can’t find this location. Recalculating your route back home!"],
    ["No Vehicles Beyond This Point!", "This page is off-limits, even for off-roaders. Back it up!"],
    ["Speed Limit Exceeded!", "You went too fast and missed the exit. Let’s slow down and head back."],
    ["Parking Lot Full!", "There’s no space here! Let’s cruise back to the main lot."],
    ["Out of Service!", "This page is in the shop for repairs. Come back later or return to the home page."]
  ];
  const funnyMessage = funnyErrorMessages[Math.floor(Math.random() * funnyErrorMessages.length)]
  const funnyerrHTML = `<div class="error-msg">
                          <span class="error-msg-main">${funnyMessage[0]}</span><br>
                          <span class="error-msg-tagline">${funnyMessage[1]}</span>
                        </div>`

  return funnyerrHTML
}


/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
    res.locals.loggedin = 0;
   next()
  }
 }
 
/* **************************************
* Middleware For Handling Errors
* Wrap other function in this for
* General Error Handling
*************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

// Check Login
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in")
    return res.redirect("/account/login")
  }
}

Util.getToolsHTML = (loggedin = false) => {
  let toolsHTML = ` <div id="tools">
                      <a title="Click to log in" href="/account/login">My account</a>
                    </div>`

  console.log(!loggedin)
  
  if(!loggedin) return toolsHTML
  if(loggedin) {
    toolsHTML = `<div id="tools">
                    <p>Welcome, ${loggedin}</p>
                    <a title="Click to log out" href="/account/logout">Log out</a>
                  </div>`
}
}

Util.verifyAccountType = (req, res, next) => {

  if (!res.locals.accountData) {
    req.flash("notice", "Please log in")
    return res.redirect("/account/login")
  }
  if (res.locals.accountData.account_type == "Admin" ||  res.locals.accountData.account_type == "Employee") {
    next()
  } else {
    req.flash("notice", "You don't have access to the management page")
    return res.redirect("/account/login")
  }
}

module.exports = Util