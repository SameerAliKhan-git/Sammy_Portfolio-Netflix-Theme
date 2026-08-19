const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connect to database
// On Vercel, the filesystem is read-only, so we use in-memory database
// Note: Data will not persist across deployments/restarts on Vercel
const isVercel = process.env.VERCEL === '1';
const dbPath = isVercel ? ':memory:' : path.join(__dirname, 'portfolio.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log(`Connected to the SQLite database (${isVercel ? 'In-Memory/Vercel' : 'Local File'}).`);
        initDb();
    }
});

function initDb() {
    db.serialize(() => {
        // Create Contacts Table
        db.run(`CREATE TABLE IF NOT EXISTS contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            subject TEXT,
            message TEXT NOT NULL,
            ip TEXT,
            user_agent TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            email_status TEXT DEFAULT 'pending',
            email_sent_at DATETIME
        )`);

        // Create Analytics Table
        db.run(`CREATE TABLE IF NOT EXISTS analytics (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            event_type TEXT NOT NULL,
            details TEXT,
            ip TEXT,
            user_agent TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
        
        console.log('Database tables initialized.');
    });
}

module.exports = db;
