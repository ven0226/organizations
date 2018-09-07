const mysql = require('mysql2/promise');

function getConnection(){
    return mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'project',
        insecureAuth : true,
    });
}

async function getOrgs() {
    let connection;
    try {
        const connection = await getConnection();
        const [rows] = await connection.execute('SELECT * FROM organizations');
        return rows;
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        connection && connection.end();
    }
    
}

async function getOrgsByName(name){
    let connection;
    try {
        const connection = await getConnection();
        const [rows] = await connection.execute('SELECT * FROM organizations where name = ?', [name]);
        return rows;
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        connection && connection.end();
    }
}

function getOrgsByCode(){

}

async function addOrgs(data){
    let connection;
    const values = []
    try {
        const row = [];
        row.push(data.name);
        row.push(data.code);
        row.push(data.description || '');
        row.push(data.URL || '');
        row.push(data.type);
        values.push(row);
        const connection = await getConnection();
        await connection.execute('Insert into organizations (name, code, description, url, type) values ?', [values]);
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        connection && connection.end();
    }
}

module.exports = {
    getOrgs,
    getOrgsByName,
    addOrgs,
}


