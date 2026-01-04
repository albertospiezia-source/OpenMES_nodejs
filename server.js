const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const db = new sqlite3.Database('./fabrica.db');

app.use(express.json()); // Serve per leggere i dati inviati in formato JSON

// API 1: Leggi tutti gli articoli (GET)
app.get('/api/articoli', (req, res) => {
    db.all("SELECT * FROM articoli", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// API 2: Scarico magazzino (POST)
app.post('/api/prelievo', (req, res) => {
    const { codice, qta } = req.body;
    db.run(
        "UPDATE articoli SET quantita = quantita - ? WHERE codice = ? AND quantita >= ?",
        [qta, codice, qta],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            if (this.changes === 0) return res.status(400).json({ error: "Articolo non trovato o scorta insufficiente" });
            res.json({ message: "Prelievo registrato con successo" });
        }
    );
});

// Inserisce un nuovo articolo
app.post('/api/articoli', (req, res) => {
    const { codice, descrizione, quantita } = req.body;
    
    // Controllo sicurezza base
    if (!codice || !descrizione) {
        return res.status(400).json({ error: "Codice e descrizione sono obbligatori" });
    }

    const sql = "INSERT INTO articoli (codice, descrizione, quantita) VALUES (?, ?, ?)";
    const params = [codice, descrizione, quantita || 0];

    db.run(sql, params, function(err) {
        if (err) {
            // Gestione errore se il codice esiste già (UNIQUE constraint)
            return res.status(400).json({ error: "Errore o codice articolo già esistente" });
        }
        res.status(201).json({
            message: "Articolo creato correttamente",
            id: this.lastID
        });
    });
});

// Modifica descrizione o quantità di un articolo tramite ID
app.put('/api/articoli/:id', (req, res) => {
    const id = req.params.id;
    const { descrizione, quantita } = req.body;

    const sql = "UPDATE articoli SET descrizione = ?, quantita = ? WHERE id = ?";
    const params = [descrizione, quantita, id];

    db.run(sql, params, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        
        if (this.changes === 0) {
            return res.status(404).json({ error: "Articolo non trovato" });
        }
        
        res.json({ message: `Articolo ${id} aggiornato con successo` });
    });
});

app.listen(3001, () => console.log("Server MES attivo su http://localhost:3001"));