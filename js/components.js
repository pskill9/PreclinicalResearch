document.addEventListener('DOMContentLoaded', async function() {
    // Load header
    const headerPlaceholder = document.querySelector('#header-placeholder');
    if (headerPlaceholder) {
        const headerResponse = await fetch('/components/header.html');
        const headerHtml = await headerResponse.text();
        headerPlaceholder.outerHTML = headerHtml;
        
        // Set active nav link based on current page
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.nav-links a').forEach(link => {
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active');
            }
        });
    }

    // Load footer
    const footerPlaceholder = document.querySelector('#footer-placeholder');
    if (footerPlaceholder) {
        const footerResponse = await fetch('/components/footer.html');
        const footerHtml = await footerResponse.text();
        footerPlaceholder.outerHTML = footerHtml;
    }
});
