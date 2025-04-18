const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i JOIN public.classification AS c ON i.classification_id = c.classification_id WHERE i.classification_id = $1`, [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error(`getclassificationsbyid error: ${error}`)
  }
}

async function getInventoryItemByInventoryId(inventory_id) {
  try{
    const data = await pool.query(
      `SELECT * FROM inventory WHERE inv_id = $1`, [inventory_id]
    )
    return data.rows[0]
  }catch (error) {
    console.error(`Couldn't get the car you requested!`)
  }
}

async function createClassification(classification_name) {
    try{

      const sql = `INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *;`

      return await pool.query(sql, [classification_name])
    } catch (error) {
      console.error(`Couldn't create the classification!`)
    }
}

async function createInventory(classification_id,
  inv_make, 
  inv_model, 
  inv_year, 
  inv_description, 
  inv_image, 
  inv_thumbnail, 
  inv_price, 
  inv_miles,
  inv_color) {
    try {
      const sql = `INSERT INTO public.inventory (
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  )
VALUES   (
    $1,
    $2,
    $3,
    $4,
    $5,
    $6,
    $7,
    $8,
    $9,
    $10
  ) RETURNING *`

    return await pool.query(sql, [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id])
    } catch (error) {
      return error.message
    }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(
  inv_id,
  inv_make,
  inv_model,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_year,
  inv_miles,
  inv_color,
  classification_id
) {
  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *;"
    const data = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
      inv_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

async function deleteInventoryItem(inv_id) {
  try {
    const sql = 'DELETE FROM inventory WHERE inv_id = $1';
    const data = await pool.query(sql, [inv_id])

    return data
  } catch (error) {
    console.error("Model error: " + error)
  }
}


// UPDATE INVENTORY FAVOURITE STATE
async function updateFavouriteState(inv_id, bool) {

  try{
  const sql= "UPDATE public.inventory SET favourite=$1 WHERE inv_id=$2 RETURNING *;"

  const result = await pool.query(sql, [bool, inv_id])
  return result
  }catch (error){
    console.log("Erropr updating favorite state")
  }
}

// GET FAVOURITE VEHICLES
async function getFavoriteInventories() {
    try{
      const data = await pool.query("SELECT * FROM public.inventory WHERE favourite=true")

      return data.rows
    } catch (error) {
      console.log("Couldn't get favourites")
    }
}

module.exports = {getClassifications, getInventoryByClassificationId, getInventoryItemByInventoryId, createClassification, createInventory, updateInventory, deleteInventoryItem,
  updateFavouriteState, getFavoriteInventories
}