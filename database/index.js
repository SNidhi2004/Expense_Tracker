const express = require('express');
const sql = require('mssql');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// Azure SQL DB configuration
const dbConfig = {
    user: 'your-username',
    password: 'your-password',
    server: 'your-server.database.windows.net',
    database: 'your-database-name',
    options: {
        encrypt: true,
        trustServerCertificate: false
    }
};

// Connect pool
const poolPromise = new sql.ConnectionPool(dbConfig)
    .connect()
    .then(pool => {
        console.log('✅ Connected to Azure SQL');
        return pool;
    })
    .catch(err => console.error('❌ DB Connection Failed:', err));

// API: Add Expense
app.post('/api/expenses', async (req, res) => {
    const { description, type, amount, date } = req.body;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('description', sql.NVarChar, description)
            .input('type', sql.NVarChar, type)
            .input('amount', sql.Decimal(10, 2), amount)
            .input('date', sql.DateTime, date)
            .query(`
                INSERT INTO Expense (description, type, amount, date)
                VALUES (@description, @type, @amount, @date)
            `);
        res.status(200).json({ message: 'Expense added successfully' });
    } catch (err) {
        console.error('Insert error:', err);
        res.status(500).json({ error: 'Failed to add expense' });
    }
});

// API: Fetch all Expenses
app.get('/api/expenses', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM Expense ORDER BY date DESC');
        res.json(result.recordset);
    } catch (err) {
        console.error('Fetch error:', err);
        res.status(500).json({ error: 'Failed to fetch expenses' });
    }
});

app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
});
