/* ===================================================
   NEXT LEVEL GAME QUEST - Main JavaScript (Part 3)
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ---------------------------------------------------
       1. Navigation Active Link Highlighting
       --------------------------------------------------- */
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav a');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.style.color = '#00FFFF';
            link.style.textDecoration = 'underline';
        }
    });

    /* ---------------------------------------------------
       2. Dynamic Search & Filter (Services Page)
       --------------------------------------------------- */
    const searchInput = document.getElementById('search-input');
    const serviceCards = document.querySelectorAll('.service-card, .banner');

    if (searchInput && serviceCards.length > 0) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();

            serviceCards.forEach(card => {
                const textContent = card.textContent.toLowerCase();
                if (textContent.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    /* ---------------------------------------------------
       3. Lightbox Gallery for Images
       --------------------------------------------------- */
    const galleryImages = document.querySelectorAll('.gallery-img, .banner img');
    
    let lightbox = document.getElementById('lightbox-modal');
    if (!lightbox && galleryImages.length > 0) {
        lightbox = document.createElement('div');
        lightbox.id = 'lightbox-modal';
        lightbox.style.cssText = `
            display: none;
            position: fixed;
            z-index: 1000;
            top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.85);
            justify-content: center;
            align-items: center;
            cursor: pointer;
        `;
        lightbox.innerHTML = `<img id="lightbox-img" style="max-width: 80%; max-height: 80%; border: 2px solid #00FFFF; border-radius: 8px;">`;
        document.body.appendChild(lightbox);

        lightbox.addEventListener('click', () => {
            lightbox.style.display = 'none';
        });
    }

    galleryImages.forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => {
            const lightboxImg = document.getElementById('lightbox-img');
            if (lightboxImg && lightbox) {
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;
                lightbox.style.display = 'flex';
            }
        });
    });

    /* ---------------------------------------------------
       4. Form Validation Helper Functions
       --------------------------------------------------- */
    function showError(inputElement, message) {
        let errorSpan = inputElement.nextElementSibling;
        if (!errorSpan || !errorSpan.classList.contains('error-msg')) {
            errorSpan = document.createElement('span');
            errorSpan.className = 'error-msg';
            errorSpan.style.color = '#FF4D4D';
            errorSpan.style.fontSize = '14px';
            errorSpan.style.display = 'block';
            errorSpan.style.marginTop = '4px';
            inputElement.parentNode.insertBefore(errorSpan, inputElement.nextSibling);
        }
        errorSpan.textContent = message;
        inputElement.style.borderColor = '#FF4D4D';
    }

    function clearError(inputElement) {
        const errorSpan = inputElement.nextElementSibling;
        if (errorSpan && errorSpan.classList.contains('error-msg')) {
            errorSpan.remove();
        }
        inputElement.style.borderColor = '#00FFFF';
    }

    /* ---------------------------------------------------
       5. ENQUIRY FORM (enquiry.html) - Cost & On-Page Message
       --------------------------------------------------- */
    const enquiryForm = document.getElementById('enquiry-form');
    if (enquiryForm) {
        enquiryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;

            const name = document.getElementById('enq-name');
            const email = document.getElementById('enq-email');
            const service = document.getElementById('enq-service');
            const date = document.getElementById('enq-date');
            const responseContainer = document.getElementById('enquiry-response');

            if (!name.value.trim() || name.value.trim().length < 2) {
                showError(name, 'Please enter a valid full name.');
                isValid = false;
            } else { clearError(name); }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email.value.trim())) {
                showError(email, 'Please enter a valid email address.');
                isValid = false;
            } else { clearError(email); }

            if (date && date.value) {
                const selectedDate = new Date(date.value);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                if (selectedDate < today) {
                    showError(date, 'Please select a current or future date.');
                    isValid = false;
                } else { clearError(date); }
            }

            if (isValid) {
                let estimatedCost = "R250 - R750";
                if (service.value === "vr") estimatedCost = "R120 - R200 per session";
                else if (service.value === "birthday") estimatedCost = "R750 - R1500 package options";
                else if (service.value === "escape") estimatedCost = "R250 per person";
                else if (service.value === "sponsor") estimatedCost = "Custom Partnership Package";

                if (responseContainer) {
                    responseContainer.style.display = 'block';
                    responseContainer.style.padding = '15px';
                    responseContainer.style.marginTop = '15px';
                    responseContainer.style.backgroundColor = '#1a0033';
                    responseContainer.style.border = '2px solid #00FFFF';
                    responseContainer.style.borderRadius = '8px';
                    responseContainer.style.color = '#FFFFFF';
                    responseContainer.innerHTML = `
                        <h3 style="color:#00FFFF; margin-bottom:8px;">Enquiry Received!</h3>
                        <p>Thank you <strong>${name.value}</strong> for reaching out.</p>
                        <p><strong>Estimated Pricing:</strong> ${estimatedCost}</p>
                        <p>We have sent confirmation details to <em>${email.value}</em>.</p>
                    `;
                }
                enquiryForm.reset();
            }
        });
    }

    /* ---------------------------------------------------
       6. CONTACT FORM (contact.html) - On-Page Message (No App Redirect)
       --------------------------------------------------- */
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;

            const name = document.getElementById('contact-name');
            const email = document.getElementById('contact-email');
            const message = document.getElementById('contact-message');

            if (!name.value.trim()) { showError(name, 'Name is required.'); isValid = false; } else { clearError(name); }
            if (!email.value.trim()) { showError(email, 'Email is required.'); isValid = false; } else { clearError(email); }
            if (!message.value.trim() || message.value.trim().length < 10) { 
                showError(message, 'Message must be at least 10 characters long.'); 
                isValid = false; 
            } else { clearError(message); }

            if (isValid) {
                let responseContainer = document.getElementById('contact-response');
                if (!responseContainer) {
                    responseContainer = document.createElement('div');
                    responseContainer.id = 'contact-response';
                    contactForm.parentNode.insertBefore(responseContainer, contactForm.nextSibling);
                }

                responseContainer.style.display = 'block';
                responseContainer.style.padding = '15px';
                responseContainer.style.marginTop = '15px';
                responseContainer.style.backgroundColor = '#1a0033';
                responseContainer.style.border = '2px solid #00FFFF';
                responseContainer.style.borderRadius = '8px';
                responseContainer.style.color = '#FFFFFF';
                responseContainer.innerHTML = `
                    <h3 style="color:#00FFFF; margin-bottom:8px;">Message Sent Successfully!</h3>
                    <p>Thank you, <strong>${name.value}</strong>. Your message has been received.</p>
                    <p>Our team will reply to <em>${email.value}</em> shortly.</p>
                `;

                contactForm.reset();
            }
        });
    }

    /* ---------------------------------------------------
       7. Footer Copyright Year
       --------------------------------------------------- */
    const footer = document.querySelector('footer');
    if (footer) {
        const year = new Date().getFullYear();
        if (!footer.textContent.includes(year)) {
            footer.innerHTML += `<br><small>&copy; ${year} NEXT LEVEL Game Quest. All rights reserved.</small>`;
        }
    }
});