const pool = require('../database')



// Create New Account
async function createAccount(account_firstname, account_lastname, account_email, account_password) {
    try {
        const sql = `INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *`

        console.log("Account Created")


        return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])

        

    } catch (error) {
        return error.message
    }
}

module.exports = {createAccount} 