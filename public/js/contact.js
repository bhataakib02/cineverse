// Contact form JavaScript

document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    const messageDiv = document.getElementById('form-message');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            messageDiv.style.display = 'block';
            messageDiv.textContent = 'Sending...';
            messageDiv.style.color = 'var(--text)';

            try {
                await submitContact(name, email, message);
                messageDiv.textContent = '✓ Thank you! Your message has been sent successfully.';
                messageDiv.style.color = '#4ade80';
                contactForm.reset();
                
                // Hide message after 5 seconds
                setTimeout(() => {
                    messageDiv.style.display = 'none';
                }, 5000);
            } catch (error) {
                messageDiv.textContent = '✗ Error sending message. Please try again.';
                messageDiv.style.color = '#f5576c';
            }
        });
    }
});

