const dao = require('./dao');

async function getOrgs() {
    let connection;
    try {
        connection = await dao.getConnection();
        const [rows] = await connection.execute('SELECT * FROM organizations');
        return rows.map(row => ({
            name: row.name,
            type: row.type,
            description: row.description,
            code: row.code,
            URL: row.URL,
        }));
    } catch (err) {
        throw err;
    } finally {
        connection && connection.end();
    }
    
}

async function getOrgsByName(name){
    let connection;
    try {
        connection = await dao.getConnection();
        const [rows] = await connection.execute('SELECT * FROM organizations where name = ?', [name]);
        return rows;
    } catch (err) {
        throw err;
    } finally {
        connection && connection.end();
    }
}

async function getOrgsByCode(code){
    let connection;
    try {
        connection = await dao.getConnection();
        const [rows] = await connection.execute('SELECT * FROM organizations where code = ?', [code]);
        return rows;
    } catch (err) {
        throw err;
    } finally {
        connection && connection.end();
    }
}

async function addOrgs(data){
    let connection;
    try {
        const row = {
            name: data.name,
            code: data.code,
            description: data.description || '',
            URL: data.URL || '',
            type: data.type,
        };
        connection = await dao.getConnection();
        const query = 'INSERT INTO organizations SET ?';
        const [insert] = await connection.query(query, [row]);
        return insert;
    } catch (err) {
        throw err;
    } finally {
        connection && connection.end();
    }
}

module.exports = {
    getOrgs,
    getOrgsByName,
    getOrgsByCode,
    addOrgs,
}


