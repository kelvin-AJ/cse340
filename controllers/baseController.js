const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  // req.flash("notice", "This is a flash message")
  res.render("index", {title: "Home", nav})
}

// Inside your controller (e.g., userController.js)
baseController.myErrorFunction = async (req, res, next) => {
  try {
      // Intentional error
      throw new Error('Intentional 500 error here ');
      
  } catch (err) {
      next(err); 
  }
};


module.exports = baseController