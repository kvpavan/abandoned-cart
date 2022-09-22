var mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit : 2000,
    host: process.env.mysql_host,
    user: process.env.mysql_username,
    password: process.env.mysql_password,
    database: process.env.mysql_database
});

module.exports = pool;
