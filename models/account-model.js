const pool = require('../database')



// Create New Account
async function createAccount(account_firstname, account_lastname, account_email, account_password) {
    try {
        const sql = `INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *`


        return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])

        

    } catch (error) {
        return error.message
    }
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
    try {
      const sql = "SELECT * FROM account WHERE account_email = $1"
      const email = await pool.query(sql, [account_email])
      return email.rowCount
    } catch (error) {
      return error.message
    }
  }

// Return account data using email address
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

async function getAccountById (account_id) {
  try {

    const result = await pool.query('SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_id = $1', [account_id])

    return result.rows[0]
  }catch (error) {
    return new Error("Trouble retrieving your account information")
  }
}

async function updateAccountInfo(account_firstname, account_lastname, account_email, account_id) {
  try {

    const result = await pool.query('UPDATE public.account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *', [account_firstname, account_lastname, account_email, account_id])

    return result.rows[0]
  }catch (error) {
    return new Error("Something went wrong with the update")
  }
}

async function updatePassword(account_password, account_id) {
  try {

    const result = await pool.query('UPDATE public.account SET account_password = $1 WHERE account_id = $2 RETURNING *', [account_password, account_id])

    console.log("SQL RESULTS:", result)

    return result.rows[0]
  }catch (error) {
    return new Error("Something went wrong with the update")
  }
  
}

module.exports = {createAccount, checkExistingEmail, getAccountByEmail, getAccountById, updateAccountInfo, updatePassword} 