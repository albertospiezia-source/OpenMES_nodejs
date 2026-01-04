const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./fabrica.db');

db.serialize(() => {
    // Creiamo la tabella
    db.run(`CREATE TABLE IF NOT EXISTS articoli (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        codice TEXT UNIQUE,
        descrizione TEXT,
        quantita INTEGER
    )`);

    // Inseriamo dei dati iniziali
    const stmt = db.prepare("INSERT OR IGNORE INTO articoli (codice, descrizione, quantita) VALUES (?, ?, ?)");
    stmt.run("BULL01", "Bullone M8", 100);
    stmt.run("VITE02", "Vite 4x40", 50);
    stmt.finalize();
    
    console.log("Database Inizializzato!");
});
db.close();