const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 8602;

// Middleware to parse JSON bodies with increased payload size limit
app.use(bodyParser.json({limit: '10mb'}));

// Middleware to enable CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Route handler for /log-error endpoint
app.post('/log-error', (req, res) => {
    const errorDetails = req.body;
    const logFilePath = path.join(__dirname, 'error-log.txt');

    // Append error details to the log file
    fs.appendFile(logFilePath, JSON.stringify(errorDetails) + '\n', (err) => {
        if (err) {
            console.error('Failed to write error details to log file:', err);
            return res.status(500).send('Failed to log error');
        }
        console.log('Error details logged successfully');
        res.status(200).send('Error logged successfully');
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Mock server running on http://localhost:${PORT}`);
});
