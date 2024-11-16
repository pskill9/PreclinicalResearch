document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    const submitButton = form.querySelector('button[type="submit"]');
    
    // Replace this URL with your Google Apps Script Web App URL after deployment
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxYOg7kpmfBMculF9Dkzc6MHCaT4oBx5fQd5DyjvX0bYY6kBgSz7osuW6evnxDXR3rn/exec';

    function showMessage(element, message = null, duration = 5000) {
        // Hide any existing messages
        successMessage.style.display = 'none';
        errorMessage.style.display = 'none';
        
        // Update message text if provided
        if (message) {
            element.textContent = message;
        }
        
        // Show the new message
        element.style.display = 'block';
        setTimeout(() => {
            element.style.display = 'none';
        }, duration);
    }

    function resetForm() {
        form.reset();
        // Remove any error styling
        form.querySelectorAll('.error').forEach(field => {
            field.classList.remove('error');
        });
    }

    function setLoadingState(isLoading) {
        submitButton.disabled = isLoading;
        submitButton.innerHTML = isLoading ? 
            '<i class="fas fa-spinner fa-spin"></i> Sending...' : 
            'Send Message';
    }

    function validateForm() {
        // Get all required fields
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        let firstInvalidField = null;

        requiredFields.forEach(field => {
            // Remove any existing error styling
            field.classList.remove('error');
            
            if (!field.value.trim()) {
                field.classList.add('error');
                isValid = false;
                if (!firstInvalidField) firstInvalidField = field;
            }

            // Email validation
            if (field.type === 'email' && field.value.trim()) {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(field.value)) {
                    field.classList.add('error');
                    isValid = false;
                    if (!firstInvalidField) firstInvalidField = field;
                }
            }
        });

        if (!isValid && firstInvalidField) {
            firstInvalidField.focus();
            showMessage(errorMessage, 'Please fill in all required fields correctly.');
        }

        return isValid;
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        // Collect form data
        const formData = {
            timestamp: new Date().toISOString(),
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            company: document.getElementById('company').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            subject: document.getElementById('subject').value.trim(),
            message: document.getElementById('message').value.trim()
        };

        // Set loading state
        setLoadingState(true);

        // Send data to Google Apps Script
        fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', // Required for Google Apps Script
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            // Since mode is 'no-cors', we can't access the response
            // We'll show a generic success message
            showMessage(successMessage, 'Your message has been sent successfully! We\'ll get back to you soon.');
            resetForm();
        })
        .catch(error => {
            console.error('Error:', error);
            showMessage(errorMessage, 'There was an error sending your message. Please try again.');
        })
        .finally(() => {
            setLoadingState(false);
        });
    });

    // Add input event listeners for real-time validation
    form.querySelectorAll('input, textarea').forEach(field => {
        field.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                this.classList.remove('error');
            }
        });
    });

    // Prevent accidental form submission when pressing Enter
    form.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
        }
    });
});

// Add these styles to your CSS file
const styles = `
    .error {
        border-color: #e74c3c !important;
    }

    .submit-btn:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }

    .fa-spinner {
        margin-right: 8px;
    }

    .success-message,
    .error-message {
        display: none;
        padding: 15px;
        margin-bottom: 20px;
        border-radius: 4px;
    }

    .success-message {
        background-color: #d4edda;
        color: #155724;
        border: 1px solid #c3e6cb;
    }

    .error-message {
        background-color: #f8d7da;
        color: #721c24;
        border: 1px solid #f5c6cb;
    }
`;

// Add styles to the document
const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);
