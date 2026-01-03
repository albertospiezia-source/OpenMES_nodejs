const fs = require('fs'); // Carica il modulo per leggere i file

// Funzione per leggere la tabella
function leggiTabella() {
    const datiGrezzi = fs.readFileSync('database.json');
    const articoli = JSON.parse(datiGrezzi);
    console.log("--- TABELLA ARTICOLI MES ---");
    console.table(articoli); // Visualizza i dati in una tabella ordinata
}

leggiTabella();