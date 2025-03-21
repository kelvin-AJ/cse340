const invModel = require("../models/inventory-model")
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
        grid += '<li>'
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

// GET Witty message for 404 Page
Util.getWittyMessage = () =>{
  const funny404Messages = [
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
  const funnyMessage = funny404Messages[Math.floor(Math.random() * funny404Messages.length)]
  const funny404HTML = `<div class="error-msg">
                          <span class="error-msg-main">${funnyMessage[0]}</span><br>
                          <span class="error-msg-tagline">${funnyMessage[1]}</span>
                        </div>`

  return funny404HTML
}


/* **************************************
* Middleware For Handling Errors
* Wrap other function in this for
* General Error Handling
*************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util