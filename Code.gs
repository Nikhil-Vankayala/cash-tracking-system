// Configuration
const SHEET_NAME = 'Records';
const SPREADSHEET_ID = '1wwackCZObQqvaltZcJi-1_-OGG6XgL0yKuHNIaCfm-o';  // Your spreadsheet ID

function createSheetIfNotExists() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);  // Open specific spreadsheet
  let sheet = ss.getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    // Add headers
    const headers = [
      'Hub ID',
      'Trip ID',
      'DH Name',
      'Date',
      'Cash Denominations',
      'Coin Denominations',
      'Cash Total',
      'Coins Total',
      'Total Collected',
      'Shortages',
      'Shortages Total',
      'Final Total',
      'Timestamp',
      'User Email'
    ];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
    
    // Format headers
    sheet.getRange(1, 1, 1, headers.length)
      .setBackground('#f3f3f3')
      .setFontWeight('bold');
    
    // Auto-resize columns
    sheet.autoResizeColumns(1, headers.length);
  }
  return sheet;
}

function doPost(e) {
  // Set CORS headers for all responses
  const headers = {
    'Access-Control-Allow-Origin': 'https://nikhil-vankayala.github.io',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Requested-With',
    'Access-Control-Allow-Credentials': 'true'
  };

  // Handle preflight requests
  if (e.method == 'OPTIONS') {
    return ContentService.createTextOutput('')
      .setMimeType(ContentService.MimeType.TEXT)
      .setHeaders(headers);
  }

  try {
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    const values = data.values;
    
    // Add timestamp to the values
    values[0].push(new Date().toISOString());
    
    // Get or create the sheet
    const sheet = createSheetIfNotExists();
    
    // Append the values to the sheet
    sheet.getRange(sheet.getLastRow() + 1, 1, 1, values[0].length).setValues(values);
    
    return ContentService.createTextOutput(JSON.stringify({
      'success': true,
      'message': 'Data saved successfully'
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders(headers);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      'success': false,
      'error': error.toString()
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders(headers);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    'status': 'ok',
    'message': 'GET request received'
  }))
  .setMimeType(ContentService.MimeType.JSON)
  .setHeaders({
    'Access-Control-Allow-Origin': 'https://nikhil-vankayala.github.io',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Requested-With',
    'Access-Control-Allow-Credentials': 'true'
  });
} 