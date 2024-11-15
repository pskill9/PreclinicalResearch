document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');

    // Replace this URL with your Google Apps Script Web App URL after deployment
    const SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL';

    function showMessage(element, duration = 5000) {
        element.style.display = 'block';
        setTimeout(() => {
            element.style.display = 'none';
        }, duration);
    }

    function resetForm() {
        form.reset();
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Collect form data
        const formData = {
            timestamp: new Date().toISOString(),
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            company: document.getElementById('company').value,
            phone: document.getElementById('phone').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };

        // Send data to Google Apps Script
        fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            showMessage(successMessage);
            resetForm();
        })
        .catch(error => {
            console.error('Error:', error);
            showMessage(errorMessage);
        });
    });
});
