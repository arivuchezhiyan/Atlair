document.addEventListener('DOMContentLoaded', () => {
    
    // ==================== MOBILE DRAWER NAVIGATION ====================
    const burgerMenuBtn = document.getElementById('burger-menu-toggle');
    const closeDrawerBtn = document.getElementById('drawer-close');
    const navDrawer = document.getElementById('mobile-nav-drawer');
    const drawerOverlay = document.getElementById('drawer-overlay');
    const drawerLinks = navDrawer.querySelectorAll('.drawer-menu a');

    function openDrawer() {
        navDrawer.classList.add('active');
        drawerOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // prevent background scrolling
    }

    function closeDrawer() {
        navDrawer.classList.remove('active');
        drawerOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (burgerMenuBtn) burgerMenuBtn.addEventListener('click', openDrawer);
    if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeDrawer);
    if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);
    
    drawerLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeDrawer();
        });
    });


    // ==================== LEAD CAPTURE MODAL ====================
    const leadModal = document.getElementById('lead-modal');
    const closeLeadModalBtn = document.getElementById('lead-modal-close');
    const openLeadBtns = document.querySelectorAll('.open-lead-modal-btn');

    function openLeadModal() {
        if (leadModal) {
            leadModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeLeadModal() {
        if (leadModal) {
            leadModal.classList.remove('active');
            if (!navDrawer.classList.contains('active')) {
                document.body.style.overflow = '';
            }
        }
    }

    openLeadBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            const href = btn.getAttribute('href');
            if (href && href.startsWith('#') && href.length > 1) {
                if (window.innerWidth <= 1024) {
                    e.preventDefault();
                    openLeadModal();
                }
            } else {
                e.preventDefault();
                openLeadModal();
            }
        });
    });

    if (closeLeadModalBtn) closeLeadModalBtn.addEventListener('click', closeLeadModal);


    // ==================== SUCCESS MODAL DIALOG ====================
    const successModal = document.getElementById('success-modal');
    const closeSuccessBtn = document.getElementById('btn-close-success-modal');
    const successClientName = document.getElementById('success-client-name');
    const successClientPhone = document.getElementById('success-client-phone');

    function openSuccessModal(name, phone) {
        if (successClientName) successClientName.textContent = name;
        if (successClientPhone) successClientPhone.textContent = phone;
        if (successModal) {
            successModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeSuccessModal() {
        if (successModal) {
            successModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    if (closeSuccessBtn) closeSuccessBtn.addEventListener('click', closeSuccessModal);


    // ==================== FORM SUBMISSION HANDLING ====================
    const leadForms = document.querySelectorAll('.lead-generation-form');
    
    leadForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const name = formData.get('clientName');
            const phone = formData.get('clientPhone');
            
            // Close lead capture modal if open
            closeLeadModal();
            
            // Reset form
            form.reset();
            
            // Open the success pop-up with user details
            openSuccessModal(name, phone);
        });
    });


    // ==================== TESTIMONIAL CAROUSEL SLIDER (MOBILE) ====================
    const carouselViewport = document.getElementById('carousel-viewport');
    const carouselTrack = document.getElementById('carousel-track');
    const carouselDots = document.querySelectorAll('.carousel-dot');
    
    let currentIndex = 0;
    const totalSlides = 4;
    let startX = 0;
    let currentX = 0;
    let isSwiping = false;
    let autoSlideInterval;

    function updateCarouselPosition() {
        if (!carouselTrack) return;
        carouselTrack.style.transform = `translateX(-${currentIndex * 25}%)`;
        
        // Update dots
        carouselDots.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    function startAutoSlide() {
        stopAutoSlide();
        autoSlideInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % totalSlides;
            updateCarouselPosition();
        }, 3500); // Auto-slide every 3.5 seconds
    }

    function stopAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
        }
    }

    // Dot click interaction
    carouselDots.forEach(dot => {
        dot.addEventListener('click', () => {
            const index = parseInt(dot.getAttribute('data-index'), 10);
            if (!isNaN(index)) {
                currentIndex = index;
                updateCarouselPosition();
                startAutoSlide(); // Reset auto-slide timer
            }
        });
    });

    // Touch events for swiping on mobile
    if (carouselViewport) {
        // Start auto sliding on initialize
        startAutoSlide();

        carouselViewport.addEventListener('touchstart', (e) => {
            stopAutoSlide();
            startX = e.touches[0].clientX;
            isSwiping = true;
            carouselTrack.style.transition = 'none'; // temporary disable transition for tracking finger
        });

        carouselViewport.addEventListener('touchmove', (e) => {
            if (!isSwiping) return;
            currentX = e.touches[0].clientX;
            const diffX = currentX - startX;
            
            // Current base offset
            const baseOffset = -currentIndex * (carouselViewport.offsetWidth);
            const totalWidth = carouselViewport.offsetWidth * totalSlides;
            
            // Calculate translate px
            let translatePx = baseOffset + diffX;
            
            // Add friction at bounds
            if (translatePx > 0) {
                translatePx = diffX * 0.3; // left bound resistance
            } else if (translatePx < -(totalWidth - carouselViewport.offsetWidth)) {
                const rightDiff = translatePx + (totalWidth - carouselViewport.offsetWidth);
                translatePx = -(totalWidth - carouselViewport.offsetWidth) + (rightDiff * 0.3); // right bound resistance
            }
            
            // Convert to percentage
            const translatePercent = (translatePx / totalWidth) * 100;
            carouselTrack.style.transform = `translateX(${translatePercent}%)`;
        });

        carouselViewport.addEventListener('touchend', (e) => {
            if (!isSwiping) return;
            isSwiping = false;
            carouselTrack.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            
            const diffX = currentX - startX;
            const swipeThreshold = 55; // swipe px threshold to trigger slide change
            
            if (diffX < -swipeThreshold && currentIndex < totalSlides - 1) {
                currentIndex++;
            } else if (diffX > swipeThreshold && currentIndex > 0) {
                currentIndex--;
            }
            
            updateCarouselPosition();
            startAutoSlide(); // Restart auto-slide timer
            // Reset coordinate variables
            startX = 0;
            currentX = 0;
        });
        
        // Handle window resizing to keep carousel aligned
        window.addEventListener('resize', () => {
            updateCarouselPosition();
        });
    }


    // ==================== SMOOTH ANCHOR LINK SCROLLING ====================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                // If it's the desktop form, add vertical offset for header
                let headerOffset = 80;
                if (window.innerWidth < 1024) {
                    headerOffset = 60;
                }
                
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==================== AUTO-POPUP FORM ON MOBILE (AFTER 2S) ====================
    if (window.innerWidth < 1024) {
        setTimeout(() => {
            const successModalActive = successModal && successModal.classList.contains('active');
            const leadModalActive = leadModal && leadModal.classList.contains('active');
            if (!successModalActive && !leadModalActive) {
                openLeadModal();
            }
        }, 2000); // Pop up after 2 seconds on loading/reloads
    }

});
