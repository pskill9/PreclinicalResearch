document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    const submitButton = form.querySelector('button[type="submit"]');
    
    // Replace this URL with your Google Apps Script Web App URL after deployment
    const SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL';

    function showMessage(element, duration = 5000) {
        // Hide any existing messages
        successMessage.style.display = 'none';
        errorMessage.style.display = 'none';
        
        // Show the new message
        element.style.display = 'block';
        setTimeout(() => {
            element.style.display = 'none';
        }, duration);
    }

    function resetForm() {
        form.reset();
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
            showMessage(errorMessage);
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
`;

// Add styles to the document
const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);
