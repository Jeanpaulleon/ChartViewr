console.log("Main process starting...");

// main.js or main.mjs
const { app, BrowserWindow, ipcMain } = require('electron');
const { Alpaca } = require('@alpacahq/alpaca-trade-api');
const path = require('path');

let mainWindow;

// Create the Disclaimer Window with the correct preload script and security settings
function createDisclaimerWindow() {
    mainWindow = new BrowserWindow({
        width: 600,
        height: 300,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true, // Keep this enabled for security
            preload: path.join(__dirname, 'preload.mjs') // Make sure this path is correct
        }
    });

    mainWindow.loadFile(path.join(__dirname, 'disclaimer.html'));
    mainWindow.on('closed', () => mainWindow = null);
}


function createMainWindow() {
    if (mainWindow) {
        mainWindow.close(); // Close the disclaimer window if open
    }

    mainWindow = new BrowserWindow({
        width: 1040,
        height: 720,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.mjs')
        }
    });

    // Open the DevTools in development mode
    if (process.env.NODE_ENV === 'development') {
        mainWindow.webContents.openDevTools();
    }

    mainWindow.loadFile(path.join(__dirname, 'index.html'));
    mainWindow.on('closed', () => mainWindow = null);
}

ipcMain.on('continue-clicked', (event) => {
    createMainWindow(); // Create main window when continue is clicked
});

// Listen for API key and secret key from renderer process
ipcMain.on('api-keys', (event, { apiKey, secretKey }) => {
    // Store the keys securely or in a configuration file
    mainWindow.webContents.send('showChart', apiKey, secretKey);
});

ipcMain.on('showChart', (event, apiKey, secretKey) => {
    // Initialize Alpaca client or use the keys for API calls
    const alpaca = new Alpaca({
        credentials: {
            apiKey: apiKey,
            secretKey: secretKey,
        },
        paper: false, // Set to true if using Alpaca's paper trading environment
    });

    // Get today's date and calculate start and end dates
    const today = new Date();
    const startDate = new Date(today.setDate(today.getDate() - 100)); // 100 days ago
    const endDate = new Date(today.setDate(today.getDate() - 1)); // Yesterday

    // Fetch data for AAPL with calculated dates and 15-minute timeframe
    alpaca.getBarsV2('AAPL', {
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        timeframe: '15Min',
    })
    .then((bars) => {
        // Display or process the fetched bars data
        console.log('Fetched bars data:', bars);
    })
    .catch((err) => {
        console.error('Error fetching bars:', err);
    });
});

app.whenReady().then(createDisclaimerWindow).catch(console.error);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createDisclaimerWindow();
    }
});
