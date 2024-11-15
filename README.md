# Anubis Pre-Clinical Research Website

A modern, responsive website for Anubis Pre-Clinical Research with integrated contact form functionality using Google Sheets.

## Features

- Modern, responsive design
- Service showcase
- Contact form with Google Sheets integration
- Spam prevention
- Email notifications for new submissions
- Easy deployment process

## Project Structure

```
anubis-preclinical/
├── index.html          # Home page
├── services.html       # Services page
├── contact.html        # Contact page
├── styles.css         # Main stylesheet
├── contact.js         # Contact form handling
├── deploy.js          # Deployment script
├── package.json       # Project dependencies
├── .env              # Environment variables
└── .gitignore        # Git ignore rules
```

## Setup Instructions

1. Clone the repository:
```bash
git clone <repository-url>
cd anubis-preclinical
```

2. Install dependencies:
```bash
npm install
```

3. Set up Google Cloud Platform:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project
   - Enable the following APIs:
     - Google Sheets API
     - Google Apps Script API
     - Google Drive API
   - Create OAuth 2.0 credentials
   - Download the credentials

4. Configure environment variables:
   - Copy the `.env.example` file to `.env`
   - Fill in your Google Cloud credentials:
     ```
     GOOGLE_CLIENT_ID=your_client_id
     GOOGLE_CLIENT_SECRET=your_client_secret
     GOOGLE_REDIRECT_URI=http://localhost:3000/oauth2callback
     GOOGLE_REFRESH_TOKEN=your_refresh_token
     NOTIFICATION_EMAIL=your_email@domain.com
     ```

5. Deploy the contact form backend:
```bash
npm run deploy
```

6. Start the development server:
```bash
npm start
```

The website will be available at `http://localhost:3000`

## Deployment

To deploy the website to a production environment:

1. Choose a web hosting service (e.g., Netlify, Vercel, GitHub Pages)
2. Update the Google Apps Script deployment URL in `contact.js`
3. Deploy the website files to your chosen hosting service

## Contact Form Setup

The contact form is automatically configured during deployment. The deployment script:
- Creates a Google Sheet to store form submissions
- Deploys a Google Apps Script web app to handle form submissions
- Updates the contact form with the correct submission URL
- Sets up spam prevention and email notifications

## Maintenance

1. Monitor form submissions in the Google Sheet
2. Check spam filters and adjust as needed
3. Update the website content as required
4. Keep dependencies updated:
```bash
npm update
```

## Security

- Environment variables are used for sensitive credentials
- Form submissions are protected by spam prevention
- Google Sheets access is restricted to authorized users
- CORS policies are configured for production use

## Browser Support

The website is compatible with:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
