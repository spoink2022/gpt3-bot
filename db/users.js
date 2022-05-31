// Handle interactions with the "users" table
// # -------------------------------------- #
const { INITIAL_TOKENS } = require('../private/config.json');

const config = require('./config.js');

module.exports.fetchUser = async function(userid) {
    let query = 'SELECT * FROM users WHERE userid=$1';
    let users = await config.pquery(query, [userid]);
    if (!users.length) { // If user does not exist in db, create user
        users = await createNewUser(userid);
    }
    return users[0];
}

async function createNewUser(userid) {
    let query = 'INSERT INTO users (userid, tokens) VALUES ($1, $2) RETURNING *';
    let res = await config.pquery(query, [userid, INITIAL_TOKENS]);
    return res;
}

module.exports.setColumns = async function(userid, obj) {
    let queryMiddle = Object.keys(obj).map(key => `${key}=${obj[key]}`).join(', ');
    let query = `UPDATE users SET ${queryMiddle} WHERE userid=$1`;
    return await config.pquery(query, [userid]);
}

module.exports.updateColumns = async function(userid, obj) {
    let queryMiddle = Object.keys(obj).map(key => `${key}=${key}+${obj[key]}`).join(', ');
    let query = `UPDATE users SET ${queryMiddle} WHERE userid=$1`;
    return await config.pquery(query, [userid]);
}