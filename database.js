import sqlite from 'sqlite3'

const db = new sqlite.Database('./products.sqlite')


async function initializeDb(){
    await dbRun("DROP TABLE IF EXISTS products")
    await dbRun("CREATE TABLE products (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, price REAL)")

    await dbRun("INSERT INTO products (name, price) VALUES (?, ?)", ["paprika", 1000.0])
    await dbRun("INSERT INTO products (name, price) VALUES (?, ?)", ["kacsa", 12000.0])
    await dbRun("INSERT INTO products (name, price) VALUES (?, ?)", ["cicakaja", 850.0])
}


async function dbQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err)
            else resolve(rows)
        })
    })
}

async function dbRun(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, function (err) {
            if (err) reject(err)
            else resolve(this)
        })
    })
}

export {db, initializeDb, dbQuery, dbRun}

