document.addEventListener('DOMContentLoaded', function() {

    // --- HELPER FUNCTION: Hạn chế tần suất gọi hàm (tối ưu hiệu năng) ---
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    // --- 1. XỬ LÝ THANH ĐIỀU HƯỚNG & NÚT VỀ ĐẦU TRANG KHI CUỘN ---
    function initScrollHandler() {
        const navbar = document.querySelector('.navbar');
        const backToTopBtn = document.querySelector('.back-to-top-btn');

        if (!navbar && !backToTopBtn) return;

        const handleScroll = () => {
            const scrollY = window.scrollY;
            if (navbar) navbar.classList.toggle('scrolled', scrollY > 50);
            if (backToTopBtn) backToTopBtn.classList.toggle('visible', scrollY > 300);
        };

        window.addEventListener('scroll', throttle(handleScroll, 100));

        if (backToTopBtn) {
            backToTopBtn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    }

    // --- 2. KHỞI TẠO MENU DI ĐỘNG ---
    function initMobileMenu() {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');

        if (!navToggle || !navMenu) return;
        
        navToggle.addEventListener('click', () => {
            document.body.classList.toggle('nav-open');
        });
        
        navMenu.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                document.body.classList.remove('nav-open');
            }
        });
    }

    // --- 3. HIỆU ỨNG HIỆN DẦN KHI CUỘN (FADE IN) ---
    function initScrollAnimations() {
        const animatedItems = document.querySelectorAll('.section, .gallery-item-link, .team-member-link');
        
        if (animatedItems.length === 0) return;

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        animatedItems.forEach(item => observer.observe(item));
    }

    // --- 4. XỬ LÝ FORM BẰNG AJAX (Không tải lại trang) ---
    function initAjaxForms() {
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const formStatus = contactForm.querySelector('.form-status');
                const submitButton = contactForm.querySelector('button[type="submit"]');

                // !! THAY THẾ 'YOUR_UNIQUE_ID' BẰNG ID THẬT TỪ FORMSPREE.IO
                if (contactForm.action.includes('YOUR_UNIQUE_ID')) {
                     formStatus.textContent = "Lỗi: Vui lòng cấu hình action của form trong file HTML.";
                     formStatus.style.color = 'red';
                     return;
                }

                submitButton.disabled = true;
                submitButton.textContent = 'Đang gửi...';

                fetch(contactForm.action, {
                    method: 'POST',
                    body: new FormData(contactForm),
                    headers: { 'Accept': 'application/json' }
                }).then(response => {
                    if (response.ok) {
                        formStatus.textContent = "Cảm ơn! Thông điệp của bạn đã được gửi.";
                        formStatus.style.color = 'lightgreen';
                        contactForm.reset();
                    } else {
                        formStatus.textContent = "Đã có lỗi xảy ra. Vui lòng thử lại.";
                        formStatus.style.color = 'red';
                    }
                }).catch(() => {
                    formStatus.textContent = "Lỗi mạng. Vui lòng kiểm tra kết nối.";
                    formStatus.style.color = 'red';
                }).finally(() => {
                    submitButton.disabled = false;
                    submitButton.textContent = 'Gửi Thông Điệp';
                });
            });
        }

        const newsletterForm = document.getElementById('newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const status = newsletterForm.querySelector('.form-status-newsletter');
                status.textContent = `Cảm ơn bạn đã đăng ký!`;
                status.style.color = 'lightgreen';
                newsletterForm.reset();
                setTimeout(() => status.textContent = '', 5000);
            });
        }
    }

    // --- 5. KHỞI TẠO MODAL "TÌM HIỂU THÊM" ---
    function initDetailsModal() {
        const readMoreButtons = document.querySelectorAll('.read-more-btn');
        const modal = document.getElementById('details-modal');
        
        if (!modal || readMoreButtons.length === 0) return;

        const modalContent = document.getElementById('modal-details-content');
        const closeBtn = modal.querySelector('.modal-close-btn');
        const overlay = modal.querySelector('.modal-overlay');

        const openModal = (content) => {
            modalContent.innerHTML = content;
            modal.classList.add('active');
        };
        const closeModal = () => modal.classList.remove('active');

        readMoreButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = button.dataset.target;
                const sourceContent = document.querySelector(targetId);
                if (sourceContent) {
                    openModal(sourceContent.innerHTML);
                }
            });
        });

        closeBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', closeModal);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
    }

    // --- GỌI TẤT CẢ CÁC HÀM KHỞI TẠO ---
    initScrollHandler();
    initMobileMenu();
    initScrollAnimations();
    initAjaxForms();
    initDetailsModal();
});