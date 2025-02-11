// Google Sheets Integration
const SCRIPT_URL = 'https://script.google.com/a/macros/jumbotail.com/s/AKfycbwhgd7gjTrsFFf2r_Y7klx_-dtgZMJ0LZB9Fva1KYHBnZLemdi2fsKdbtj6lZ9zsxQ2/exec'; // You'll get this after new deployment

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
            mode: 'no-cors',
            credentials: 'include',  // Important for company domain
            redirect: 'follow',
            headers: {
                'Content-Type': 'application/json',
                'Origin': window.location.origin
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