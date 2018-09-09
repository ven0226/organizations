'use strict';

const mysql = require('mysql2/promise');

async function getConnection(){
    return mysql.createConnection({
        host: 'localhost',
        user: 'test',
        password: 'test',
        database: 'personal',
    });
}

module.exports = {
    getConnection,
};
