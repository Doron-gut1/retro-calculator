const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const sql = require('mssql');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  });

  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// SQL Server connection configuration
const sqlConfig = {
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  database: process.env.SQL_DATABASE,
  server: process.env.SQL_SERVER,
  options: {
    encrypt: true,
    trustServerCertificate: true
  }
};

// IPC handlers for database operations
ipcMain.handle('search-property', async (event, propertyId) => {
  try {
    await sql.connect(sqlConfig);
    const result = await sql.query`
      SELECT * FROM hs 
      WHERE hskod = ${propertyId}
    `;
    return result.recordset[0];
  } catch (err) {
    console.error('Database error:', err);
    throw err;
  } finally {
    await sql.close();
  }
});

ipcMain.handle('calculate-retro', async (event, params) => {
  try {
    await sql.connect(sqlConfig);
    
    // 1. Prepare the data
    await sql.query`
      EXEC PrepareRetroData 
        @hs = ${params.hs},
        @mspkod = ${params.mspkod}
    `;

    // 2. Multiply rows
    await sql.query`
      EXEC MultiplyTempArnmforatRows
        @HS = ${params.hs},
        @NewSugtsList = ${params.sugtsList},
        @IsYearlyCharge = ${params.isYearlyCharge}
    `;

    // 3. Call the DLL (we'll implement this next)
    // TODO: Add edge-js or node-ffi integration here

    return { success: true };
  } catch (err) {
    console.error('Calculation error:', err);
    
    // Log error to database
    await sql.query`
      EXEC AddDbErrors
        @user = ${params.userName},
        @errnum = '0',
        @errdesc = ${err.message},
        @modulname = 'RetroCalculator',
        @errline = 0
    `;
    
    throw err;
  } finally {
    await sql.close();
  }
});
