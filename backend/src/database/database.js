const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

// pasta onde o banco será armazenado
const dataDirectory = path.join(__dirname, "../../data");

// caso a pasta não exista, ela será criada
fs.mkdirSync(dataDirectory, { recursive: true });

const databasePath = path.join(dataDirectory, "database.sqlite");

// irá criar o banco de dados e criar a tabela abaixo, se já estiver criado apenas abre e exportar a conexão
const db = new Database(databasePath);

db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL COLLATE NOCASE UNIQUE,
        login TEXT NOT NULL COLLATE NOCASE UNIQUE, 
        password_hash TEXT NOT NULL,
        active INTEGER NOT NULL DEFAULT 1
            CHECK (active IN (0, 1))
    );
    `);

module.exports = db;