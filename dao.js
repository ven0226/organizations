const mysql = require('mysql2/promise');

async function getConnection(){
    return mysql.createConnection({
        host: 'localhost',
        user: 'test',
        password: 'test',
        database: 'personal',
    });
}

async function execute(conn, query, args){
    return conn.execute(query, args);
}

module.exports = {
    getConnection,
    execute,
};
