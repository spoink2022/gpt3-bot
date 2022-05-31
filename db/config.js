const { Pool } = require('pg');
const { DB_CONFIG } = require('../private/config.json');

const pool = new Pool (DB_CONFIG);

module.exports.pquery = async function(text, params) {
    const result = await pool.query(text, params);
    return result.rows;
};