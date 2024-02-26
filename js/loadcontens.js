document.addEventListener('DOMContentLoaded', function() {
    // Load header
    const headerElement = document.getElementById('header');
    if (headerElement) {
        fetch('header.html')
            .then(response => response.text())
            .then(data => headerElement.innerHTML = data);
    }

    // Load footer
    const footerElement = document.getElementById('footer');
    if (footerElement) {
        fetch('footer.html')
            .then(response => response.text())
            .then(data => footerElement.innerHTML = data);
    }
});
