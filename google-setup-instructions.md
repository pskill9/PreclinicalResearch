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

## Step 2: Set Up Google Apps Script

1. In your Google Sheet, click on "Extensions" > "Apps Script"
2. Delete any existing code in the editor
3. Copy and paste this code:

```javascript
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  try {
    // Parse the JSON data from the request
    const data = JSON.parse(e.postData.contents);
    
    // Append the form data to the sheet
    sheet.appendRow([
      data.timestamp,
      data.name,
      data.email,
      data.company,
      data.phone,
      data.subject,
      data.message
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'success',
      'message': 'Data successfully recorded'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'error',
      'message': error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

## Step 3: Deploy the Apps Script

1. Click on "Deploy" > "New deployment"
2. Click "Select type" > "Web app"
3. Fill in the deployment details:
   - Description: "Anubis Contact Form Handler"
   - Execute as: "Me"
   - Who has access: "Anyone"
4. Click "Deploy"
5. Click "Authorize access" and grant the necessary permissions
6. Copy the Web App URL provided

## Step 4: Update the Contact Form

1. Open `contact.js` in your website files
2. Replace 'YOUR_GOOGLE_APPS_SCRIPT_URL' with the Web App URL you copied:

```javascript
const SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL';
// Replace with your copied Web App URL
```

## Step 5: Test the Integration

1. Start your website locally:
```bash
npm start
```

2. Go to the contact page
3. Fill out and submit the form
4. Check your Google Sheet - you should see the submission appear as a new row

## Troubleshooting

If submissions aren't appearing in your sheet:

1. Check the Web App URL in contact.js is correct
2. Ensure you authorized the Apps Script
3. Verify the Google Sheet is in the correct format
4. Check browser console for any errors
5. Try submitting the form again

## Security Notes

- The form is configured to accept submissions from any origin
- Data is stored securely in your Google Sheet
- Only you can access the sheet and its contents
- Form submissions include timestamps for tracking
- Basic spam prevention is implemented

## Maintenance

1. Regularly check the Google Sheet for new submissions
2. Clear or archive old submissions as needed
3. Monitor for any unusual activity
4. Keep the Apps Script deployment URL private

Need help? Contact your website administrator or refer to the [Google Apps Script documentation](https://developers.google.com/apps-script).
