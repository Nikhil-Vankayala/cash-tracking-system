// Add this at the top of script.js
console.log("Script loaded!");
alert("Script loaded!");

// Initialize the date field with today's date
document.addEventListener('DOMContentLoaded', function() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').value = today;

    // Set some dummy HUB ID (this would come from the system in real implementation)
    document.getElementById('hubId').value = "12345";
});

// Handle Trip ID change and update DH Name
document.getElementById('tripId').addEventListener('change', function() {
    // This is a dummy implementation - in real system, this would fetch DH name from database
    const dhNames = {
        "1001": "John Doe",
        "1002": "Jane Smith",
        "1003": "Mike Johnson"
    };
    
    const dhName = dhNames[this.value] || "";
    document.getElementById('dhName').value = dhName;
});

// Handle denomination calculations
const denominationInputs = document.querySelectorAll('.count-input');
denominationInputs.forEach(input => {
    input.addEventListener('input', function() {
        calculateAmount(this);
        updateTotals();
    });
});

function calculateAmount(input) {
    const count = parseInt(input.value) || 0;
    const denomination = parseInt(input.dataset.denomination);
    const amount = count * denomination;
    input.parentElement.nextElementSibling.textContent = amount.toLocaleString();
}

function updateTotals() {
    // Calculate cash total
    let cashTotal = 0;
    document.querySelectorAll('#cashTable .amount').forEach(cell => {
        cashTotal += parseInt(cell.textContent.replace(/,/g, '')) || 0;
    });
    document.getElementById('totalCash').textContent = cashTotal.toLocaleString();

    // Calculate coins total
    let coinsTotal = 0;
    document.querySelectorAll('#coinsTable .amount').forEach(cell => {
        coinsTotal += parseInt(cell.textContent.replace(/,/g, '')) || 0;
    });
    document.getElementById('totalCoins').textContent = coinsTotal.toLocaleString();

    // Calculate total money collected
    const totalMoneyCollected = cashTotal + coinsTotal;
    document.getElementById('totalMoneyCollected').textContent = totalMoneyCollected.toLocaleString();
    document.getElementById('summaryTotalCollected').textContent = totalMoneyCollected.toLocaleString();

    // Update final total
    updateFinalTotal();
}

// Handle shortages
document.getElementById('addShortage').addEventListener('click', function() {
    const tbody = document.querySelector('#shortagesTable tbody');
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td><input type="number" class="shortage-ticket"></td>
        <td><input type="number" class="shortage-amount"></td>
        <td><input type="text" class="shortage-remarks"></td>
        <td><button class="delete-shortage">Delete</button></td>
    `;
    tbody.appendChild(newRow);

    // Add event listeners to new inputs
    const amountInput = newRow.querySelector('.shortage-amount');
    amountInput.addEventListener('input', function() {
        updateTotalShortages();
        updateFinalTotal();
    });

    newRow.querySelector('.delete-shortage').addEventListener('click', function() {
        newRow.remove();
        updateTotalShortages();
        updateFinalTotal();
    });
});

function updateTotalShortages() {
    let total = 0;
    document.querySelectorAll('.shortage-amount').forEach(input => {
        total += parseInt(input.value) || 0;
    });
    document.getElementById('totalShortages').textContent = total.toLocaleString();
    document.getElementById('summaryTotalShortages').textContent = total.toLocaleString();
}

function updateFinalTotal() {
    const totalCollected = parseInt(document.getElementById('totalMoneyCollected').textContent.replace(/,/g, '')) || 0;
    const shortagesTotal = parseInt(document.getElementById('totalShortages').textContent.replace(/,/g, '')) || 0;
    const finalTotal = totalCollected + shortagesTotal;
    document.getElementById('finalTotal').textContent = finalTotal.toLocaleString();
}

// Handle form submission
document.getElementById('submitButton').addEventListener('click', async function() {
    // Collect all the data
    const formData = {
        hubId: document.getElementById('hubId').value,
        tripId: document.getElementById('tripId').value,
        dhName: document.getElementById('dhName').value,
        date: document.getElementById('date').value,
        cashDenominations: [],
        coinDenominations: [],
        shortages: [],
        totals: {
            cashTotal: document.getElementById('totalCash').textContent,
            coinsTotal: document.getElementById('totalCoins').textContent,
            totalCollected: document.getElementById('totalMoneyCollected').textContent,
            shortagesTotal: document.getElementById('totalShortages').textContent,
            finalTotal: document.getElementById('finalTotal').textContent
        }
    };

    // Collect cash denomination data
    document.querySelectorAll('#cashTable .count-input').forEach(input => {
        formData.cashDenominations.push({
            denomination: input.dataset.denomination,
            count: input.value || 0,
            amount: input.parentElement.nextElementSibling.textContent
        });
    });

    // Collect coin denomination data
    document.querySelectorAll('#coinsTable .count-input').forEach(input => {
        formData.coinDenominations.push({
            denomination: input.dataset.denomination,
            count: input.value || 0,
            amount: input.parentElement.nextElementSibling.textContent
        });
    });

    // Collect shortages data
    document.querySelectorAll('#shortagesTable tbody tr').forEach(row => {
        formData.shortages.push({
            ticketId: row.querySelector('.shortage-ticket').value,
            amount: row.querySelector('.shortage-amount').value,
            remarks: row.querySelector('.shortage-remarks').value
        });
    });

    try {
        // Save to Google Sheets
        await saveToGoogleSheets(formData);
        alert('Data successfully saved!');
    } catch (error) {
        console.error('Error:', error);
        alert('Error saving data. Please try again.');
    }
}); 