var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'classmysql.engr.oregonstate.edu',
    user: 'cs290_mpoyis',
    password: '3094',
    database: 'cs290_mpoyis'
});

module.exports.pool = pool;