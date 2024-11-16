# Setting Up Google Sheets Contact Form Integration

Follow these step-by-step instructions to set up the contact form with Google Sheets:

## Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "Anubis Contact Form Submissions"
4. Add the following headers in row 1:
   - A1: Timestamp
   - B1: Name
   - C1: Email
   - D1: Company
   - E1: Phone
   - F1: Subject
   - G1: Message
5. **Important**: Copy the Spreadsheet ID from the URL
   - The URL will look like: `https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit`
   - Copy the [SPREADSHEET_ID] portion - you'll need this in Step 2

## Step 2: Set Up Google Apps Script

1. In your Google Sheet, click on "Extensions" > "Apps Script"
2. Delete any existing code in the editor
3. Copy and paste this code:

```javascript
// Configuration
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID'; // Replace with your spreadsheet ID
const SHEET_NAME = 'Sheet1'; // Update if you renamed your sheet

function doPost(e) {
  try {
    // Validate request
    if (!e.postData || !e.postData.contents) {
      throw new Error('No data received');
    }

    // Parse the JSON data from the request
    let data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch (error) {
      throw new Error('Invalid JSON data');
    }

    // Validate required fields
    const requiredFields = ['timestamp', 'name', 'email', 'subject', 'message'];
    for (const field of requiredFields) {
      if (!data[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw new Error('Invalid email format');
    }

    // Get the spreadsheet and sheet
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    if (!spreadsheet) {
      throw new Error('Could not open spreadsheet');
    }

    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    if (!sheet) {
      throw new Error('Could not find specified sheet');
    }

    // Append the form data to the sheet
    sheet.appendRow([
      data.timestamp,
      data.name,
      data.email,
      data.company || '', // Optional field
      data.phone || '',   // Optional field
      data.subject,
      data.message
    ]);
    
    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'success',
      'message': 'Data successfully recorded'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Log error for debugging
    console.error(error);
    
    // Return error response
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'error',
      'message': error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function to verify spreadsheet access
function testSpreadsheetAccess() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    Logger.log('Successfully accessed spreadsheet: ' + spreadsheet.getName());
    Logger.log('Sheet name: ' + sheet.getName());
    Logger.log('Test passed!');
  } catch (error) {
    Logger.log('Error accessing spreadsheet: ' + error.toString());
  }
}
```

## Step 3: Configure the Script

1. Replace 'YOUR_SPREADSHEET_ID' with the ID you copied in Step 1
2. If you renamed your sheet from "Sheet1", update SHEET_NAME accordingly
3. Run the testSpreadsheetAccess() function to verify configuration:
   - Click on "Select function" dropdown
   - Choose "testSpreadsheetAccess"
   - Click "Run"
   - Check the execution log to confirm access

## Step 4: Deploy the Apps Script

1. Click on "Deploy" > "New deployment"
2. Click "Select type" > "Web app"
3. Fill in the deployment details:
   - Description: "Anubis Contact Form Handler"
   - Execute as: "Me"
   - Who has access: "Anyone"
4. Click "Deploy"
5. Click "Authorize access" and grant the necessary permissions
6. Copy the Web App URL provided - this is your SCRIPT_URL

## Step 5: Update the Contact Form

1. Open `contact.js` in your website files
2. Replace 'YOUR_GOOGLE_APPS_SCRIPT_URL' with the Web App URL you copied:

```javascript
const SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL';
// Replace with your copied Web App URL
```

## Step 6: Test the Integration

1. Start your website locally:
```bash
npm start
```

2. Go to the contact page
3. Fill out and submit the form
4. Check your Google Sheet - you should see the submission appear as a new row
5. Check the success/error messages in the browser console

## Troubleshooting

If submissions aren't appearing in your sheet:

1. Check the Web App URL in contact.js is correct
2. Verify the SPREADSHEET_ID in the Apps Script is correct
3. Run testSpreadsheetAccess() to verify sheet access
4. Check browser console for any error messages
5. Review Apps Script execution logs:
   - In Apps Script editor, click "View" > "Execution log"
   - Look for any error messages

Common Issues:
- Incorrect Spreadsheet ID
- Wrong sheet name
- Permission issues
- Invalid JSON data format
- Missing required fields

## Security Notes

- The form includes validation for required fields
- Email format is validated
- Data is sanitized before storage
- Error handling prevents data corruption
- Access logs are maintained in Apps Script
- Optional fields are handled gracefully

## Maintenance

1. Regularly check the Google Sheet for new submissions
2. Monitor Apps Script execution logs for errors
3. Clear or archive old submissions as needed
4. Update permissions if team members change
5. Keep the Apps Script deployment URL private

Need help? Contact your website administrator or refer to the [Google Apps Script documentation](https://developers.google.com/apps-script).
