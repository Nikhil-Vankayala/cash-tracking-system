# Cash Recording System

A simple web-based cash recording system for managing cash denominations and shortages.

## How to Run Locally

### Method 1: Using Python (Recommended)

1. Make sure you have Python installed on your system
2. Open a terminal/command prompt
3. Navigate to this project directory
4. Run one of these commands:
   ```bash
   # Option 1: Using Python (3.x)
   python3 -m http.server 8000 --bind 127.0.0.1

   # Option 2: Using Node.js
   npx http-server -a 127.0.0.1 -p 8000

   # Option 3: Using PHP
   php -S 127.0.0.1:8000
   ```
5. Open your web browser and visit: `http://localhost:8000`

### Method 2: Direct File Opening

Simply double-click the `index.html` file to open it in your default web browser.

## Features

- Automatic date setting
- Dynamic cash denomination calculations
- Shortage tracking
- Real-time total calculations
- Summary view
- Form data collection for submission

## Test Data

To test the DH Name auto-population, use these Trip IDs:
- 1001 (John Doe)
- 1002 (Jane Smith)
- 1003 (Mike Johnson) 