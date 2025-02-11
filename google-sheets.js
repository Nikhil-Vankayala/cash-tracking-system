// Google Sheets Integration
const SCRIPT_URL = 'https://script.google.com/a/macros/jumbotail.com/s/AKfycbyUyLn33nvD3aQ34q4KhSTKK9iY5EJtA7rVF3O3woWRXfYF2ntYL_eLzNyU68uGaC4brg/exec';  // Add the new URL you get

// Function to save data to Google Sheets
async function saveToGoogleSheets(formData) {
    try {
        console.log('Preparing data for Google Sheets:', formData);

        // Format cash denominations
        const cashDenomStr = formData.cashDenominations
            .map(d => `${d.denomination}:${d.count}:${d.amount}`)
            .join('|');

        // Format coin denominations
        const coinDenomStr = formData.coinDenominations
            .map(d => `${d.denomination}:${d.count}:${d.amount}`)
            .join('|');

        // Format shortages
        const shortagesStr = JSON.stringify(formData.shortages);

        // Format the data for Google Sheets
        const values = [
            [
                formData.hubId,
                formData.tripId,
                formData.dhName,
                formData.date,
                cashDenomStr,
                coinDenomStr,
                formData.totals.cashTotal,
                formData.totals.coinsTotal,
                formData.totals.totalCollected,
                shortagesStr,
                formData.totals.shortagesTotal,
                formData.totals.finalTotal
            ]
        ];

        // Send data to Google Apps Script
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'cors',  // Changed from no-cors to cors
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Origin': 'https://nikhil-vankayala.github.io'
            },
            body: JSON.stringify({
                values: values
            })
        });

        console.log('Request sent successfully');
        alert('Data submitted successfully! Please check your Google Sheet.');
        return true;

    } catch (error) {
        console.error('Error saving to Google Sheets:', error);
        alert('Error saving data. Please check if you are logged into your Jumbotail account and try again.');
        throw error;
    }
} 