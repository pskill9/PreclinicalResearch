require('dotenv').config();
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// Configure OAuth2 client
const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

// Set credentials
oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN
});

// Function to create Google Sheet and deploy Apps Script
async function deployContactForm() {
    try {
        // Create new Google Sheet
        const sheets = google.sheets({ version: 'v4', auth: oauth2Client });
        const spreadsheet = await sheets.spreadsheets.create({
            resource: {
                properties: {
                    title: 'Anubis Contact Form Submissions'
                },
                sheets: [{
                    properties: {
                        title: 'Form Submissions',
                        gridProperties: {
                            rowCount: 1000,
                            columnCount: 7
                        }
                    },
                    data: [{
                        rowData: [{
                            values: [
                                { userEnteredValue: { stringValue: 'Timestamp' } },
                                { userEnteredValue: { stringValue: 'Name' } },
                                { userEnteredValue: { stringValue: 'Email' } },
                                { userEnteredValue: { stringValue: 'Company' } },
                                { userEnteredValue: { stringValue: 'Phone' } },
                                { userEnteredValue: { stringValue: 'Subject' } },
                                { userEnteredValue: { stringValue: 'Message' } }
                            ]
                        }]
                    }]
                }]
            }
        });

        console.log('Created Google Sheet:', spreadsheet.data.spreadsheetId);

        // Set up Apps Script project
        const script = google.script({ version: 'v1', auth: oauth2Client });
        
        // Apps Script content with spam prevention and email notification
        const scriptContent = `
            // Configuration
            const NOTIFICATION_EMAIL = "${process.env.NOTIFICATION_EMAIL || ''}";
            const SPREADSHEET_ID = "${spreadsheet.data.spreadsheetId}";

            function doPost(e) {
                const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheets()[0];
                
                try {
                    const data = JSON.parse(e.postData.contents);
                    
                    // Spam check
                    if (isSpam(data)) {
                        return ContentService.createTextOutput(JSON.stringify({
                            'status': 'error',
                            'message': 'Submission flagged as spam'
                        })).setMimeType(ContentService.MimeType.JSON);
                    }
                    
                    // Append data to sheet
                    sheet.appendRow([
                        data.timestamp,
                        data.name,
                        data.email,
                        data.company,
                        data.phone,
                        data.subject,
                        data.message
                    ]);
                    
                    // Send email notification if configured
                    if (NOTIFICATION_EMAIL) {
                        sendEmailNotification(data);
                    }
                    
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

            function isSpam(data) {
                const spamIndicators = [
                    "viagra",
                    "casino",
                    "lottery",
                    "winner",
                    "bitcoin",
                    "crypto",
                    "investment opportunity"
                ];
                
                const textToCheck = \`\${data.name} \${data.email} \${data.subject} \${data.message}\`.toLowerCase();
                return spamIndicators.some(indicator => textToCheck.includes(indicator));
            }

            function sendEmailNotification(data) {
                const subject = "New Contact Form Submission - Anubis Pre-Clinical";
                const message = \`
                    New contact form submission received:
                    
                    Name: \${data.name}
                    Email: \${data.email}
                    Company: \${data.company}
                    Phone: \${data.phone}
                    Subject: \${data.subject}
                    Message: \${data.message}
                    Timestamp: \${data.timestamp}
                \`;
                
                MailApp.sendEmail(NOTIFICATION_EMAIL, subject, message);
            }
        `;

        // Create new Apps Script project
        const scriptProject = await script.projects.create({
            resource: {
                title: 'Anubis Contact Form Handler'
            }
        });

        console.log('Created Apps Script project:', scriptProject.data.scriptId);

        // Update project content
        await script.projects.updateContent({
            scriptId: scriptProject.data.scriptId,
            resource: {
                files: [{
                    name: 'Code',
                    type: 'SERVER_JS',
                    source: scriptContent
                }, {
                    name: 'appsscript',
                    type: 'JSON',
                    source: JSON.stringify({
                        timeZone: 'America/New_York',
                        dependencies: {
                            enabledAdvancedServices: [{
                                userSymbol: 'Sheets',
                                serviceId: 'sheets',
                                version: 'v4'
                            }]
                        },
                        webapp: {
                            access: 'ANYONE_ANONYMOUS',
                            executeAs: 'USER_DEPLOYING'
                        }
                    })
                }]
            }
        });

        // Create new version
        const version = await script.projects.versions.create({
            scriptId: scriptProject.data.scriptId,
            resource: {
                description: 'Initial deployment'
            }
        });

        console.log('Created new version:', version.data.versionNumber);

        // Deploy as web app
        const deployment = await script.projects.deployments.create({
            scriptId: scriptProject.data.scriptId,
            resource: {
                versionNumber: version.data.versionNumber,
                manifestFileName: 'appsscript.json',
                description: 'Web app deployment'
            }
        });

        const deploymentUrl = `https://script.google.com/macros/s/${deployment.data.deploymentId}/exec`;
        console.log('Deployment URL:', deploymentUrl);

        // Update contact.js with the deployment URL
        const contactJsPath = path.join(__dirname, 'contact.js');
        let contactJs = fs.readFileSync(contactJsPath, 'utf8');
        contactJs = contactJs.replace('YOUR_GOOGLE_APPS_SCRIPT_URL', deploymentUrl);
        fs.writeFileSync(contactJsPath, contactJs);

        console.log('\nDeployment completed successfully!');
        console.log('Summary:');
        console.log('- Google Sheet ID:', spreadsheet.data.spreadsheetId);
        console.log('- Apps Script ID:', scriptProject.data.scriptId);
        console.log('- Deployment URL:', deploymentUrl);
        console.log('\nNext steps:');
        console.log('1. Open the Google Sheet to verify it\'s created correctly');
        console.log('2. Test the contact form to ensure submissions are working');
        console.log('3. Monitor the spam filter and adjust as needed');

    } catch (error) {
        console.error('Deployment failed:', error);
        process.exit(1);
    }
}

// Run the deployment
deployContactForm();
