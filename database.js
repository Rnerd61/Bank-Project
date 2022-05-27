const sqlite = require('sqlite-async');
const crypto = require('crypto');
const {compileQueryParser} = require("express/lib/utils");

class Database {
    constructor(db_file) {
        this.db_file = db_file;
        this.db = undefined;
    }
    
    async connect() {
        this.db = await sqlite.open(this.db_file);
    }

    async migrate() {
        return this.db.exec(`
            DROP TABLE IF EXISTS users;

            CREATE TABLE IF NOT EXISTS users (
                id         INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                username   VARCHAR(255) NOT NULL UNIQUE,
                password   VARCHAR(255) NOT NULL,
                balance    INTEGER
            );
        `);
    }

    async register(user, pass) {
        return new Promise(async (resolve, reject) => {
            try {
                let query = `INSERT INTO users (username, password, balance) VALUES ('${user}', '${pass}', 0)`;
                resolve(await this.db.run(query));
            } catch(e) {
                reject(e);
            }
        });
    }

    async login(user, pass) {
        return new Promise(async (resolve, reject) => {
            try {
                let smt = await this.db.prepare('SELECT username FROM users WHERE username = ? and password = ?');
                let row = await smt.get(user, pass);

                if(!row){
                    reject();
                }else {
                    resolve();
                }
            } catch(e) {
                reject(e);
            }
        });
    }

    async get_user(cookie){
        let smt = await this.db.prepare('SELECT username, balance FROM users');
        let c = await smt.get();
        console.log(c);
        console.log('hello');
    }
}

module.exports = Database;