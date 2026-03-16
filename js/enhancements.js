/**
 * DSTCC — Enhancements JS
 * Kỹ thuật rút ra từ senior projects, viết lại bằng Vanilla JS (không cần jQuery)
 *
 * Gồm 4 module:
 *   1. Counter Animation  — đếm số từ 0 → target khi scroll vào vùng nhìn thấy
 *   2. Parallax Hero      — hiệu ứng chiều sâu cho hero background
 *   3. Form Validation    — validate form #lien-he với thông báo lỗi inline
 *   4. Typed Text         — gõ chữ tự động cho hero subtitle (bonus)
 */

(function () {
    'use strict';

    /* ============================================================
     * 1. COUNTER ANIMATION
     * Cách dùng: thêm data-count="200" vào element
     * Ví dụ: <span class="counter" data-count="200">0</span>
     *
     * Giải thích kỹ thuật:
     *   - IntersectionObserver: theo dõi khi element xuất hiện trên màn hình
     *   - easeOutQuad: công thức làm chậm dần ở cuối (giống senior project)
     *   - requestAnimationFrame: animation mượt, không block UI
     * ============================================================ */
    function initCounters() {
        var counters = document.querySelectorAll('[data-count]');
        if (!counters.length) return;

        // Easing function: bắt đầu nhanh, chậm dần ở cuối
        function easeOutQuad(t) {
            return t * (2 - t);
        }

        function animateCounter(el) {
            var target = parseInt(el.getAttribute('data-count'), 10);
            var duration = parseInt(el.getAttribute('data-count-duration') || '2000', 10);
            var prefix = el.getAttribute('data-count-prefix') || '';
            var suffix = el.getAttribute('data-count-suffix') || '';
            var startTime = null;

            function step(timestamp) {
                if (!startTime) startTime = timestamp;
                var elapsed = timestamp - startTime;
                var progress = Math.min(elapsed / duration, 1);
                var easedProgress = easeOutQuad(progress);
                var current = Math.floor(easedProgress * target);

                el.textContent = prefix + current.toLocaleString('vi-VN') + suffix;

                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    el.textContent = prefix + target.toLocaleString('vi-VN') + suffix;
                }
            }

            requestAnimationFrame(step);
        }

        // Chỉ chạy animation khi element vào vùng nhìn thấy
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target); // chỉ chạy 1 lần
                }
            });
        }, { threshold: 0.3 });

        counters.forEach(function (el) {
            observer.observe(el);
        });
    }


    /* ============================================================
     * 2. PARALLAX HERO BACKGROUND
     * Cách dùng: thêm class "parallax-bg" vào element background
     * Ví dụ: <div class="hero-banner parallax-bg">
     *
     * Giải thích kỹ thuật (học từ Skrollr trong senior project):
     *   - Skrollr dùng data-attribute: data-0="transform:translateY(0)" data-500="transform:translateY(200px)"
     *   - Phiên bản modern: dùng CSS transform + scroll event + requestAnimationFrame
     *   - Chỉ chạy trên desktop (window.innerWidth > 992) để tránh lag mobile
     *   - will-change: transform giúp GPU composite riêng, không reflow layout
     * ============================================================ */
    function initParallax() {
        var parallaxEls = document.querySelectorAll('.parallax-bg');
        if (!parallaxEls.length) return;

        // Tắt trên mobile — giống cách senior project check
        if (window.innerWidth <= 992) return;

        var ticking = false;

        function updateParallax() {
            var scrollY = window.pageYOffset;
            parallaxEls.forEach(function (el) {
                var speed = parseFloat(el.getAttribute('data-parallax-speed') || '0.4');
                var rect = el.getBoundingClientRect();
                var elementTop = scrollY + rect.top;
                var offset = (scrollY - elementTop) * speed;
                el.style.backgroundPositionY = 'calc(50% + ' + offset + 'px)';
            });
            ticking = false;
        }

        window.addEventListener('scroll', function () {
            if (!ticking) {
                requestAnimationFrame(updateParallax); // throttle bằng rAF
                ticking = true;
            }
        }, { passive: true }); // passive: true → không block scroll
    }


    /* ============================================================
     * 3. FORM VALIDATION — cho section #lien-he
     * HTML mẫu:
     *   <form id="contactForm" novalidate>
     *     <input type="text" name="name" data-validate="required|minlength:2" data-label="Họ tên">
     *     <input type="email" name="email" data-validate="required|email" data-label="Email">
     *     <input type="tel" name="phone" data-validate="required|phone" data-label="Số điện thoại">
     *     <textarea name="message" data-validate="required|minlength:10" data-label="Nội dung"></textarea>
     *     <button type="submit">Gửi</button>
     *   </form>
     *
     * Giải thích kỹ thuật (học từ jQuery Validate trong senior project):
     *   - jQuery Validate dùng rules: { email: { required: true, email: true } }
     *   - Phiên bản vanilla: dùng data-validate attribute để khai báo rules
     *   - Validate realtime khi blur (rời field) + khi submit
     *   - Thông báo lỗi inject inline dưới field, tự xóa khi hợp lệ
     * ============================================================ */
    function initFormValidation() {
        var form = document.getElementById('contactForm');
        if (!form) return;

        // Rules dictionary
        var rules = {
            required: function (val) {
                return val.trim() !== '' || 'Trường này không được để trống.';
            },
            email: function (val) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()) || 'Email không hợp lệ.';
            },
            phone: function (val) {
                return /^(0|\+84)[0-9]{9,10}$/.test(val.replace(/\s/g, '')) || 'Số điện thoại không hợp lệ (VD: 0913446353).';
            },
            minlength: function (val, param) {
                return val.trim().length >= parseInt(param, 10)
                    || 'Cần ít nhất ' + param + ' ký tự.';
            },
            maxlength: function (val, param) {
                return val.trim().length <= parseInt(param, 10)
                    || 'Tối đa ' + param + ' ký tự.';
            }
        };

        function showError(field, msg) {
            clearError(field);
            field.classList.add('is-invalid');
            var err = document.createElement('div');
            err.className = 'invalid-feedback d-block';
            err.setAttribute('role', 'alert');
            err.textContent = msg;
            field.parentNode.insertBefore(err, field.nextSibling);
        }

        function clearError(field) {
            field.classList.remove('is-invalid');
            field.classList.add('is-valid');
            var next = field.nextSibling;
            if (next && next.classList && next.classList.contains('invalid-feedback')) {
                next.remove();
            }
        }

        function validateField(field) {
            var ruleStr = field.getAttribute('data-validate');
            if (!ruleStr) return true;
            var parts = ruleStr.split('|');
            var val = field.value;

            for (var i = 0; i < parts.length; i++) {
                var part = parts[i];
                var colonIdx = part.indexOf(':');
                var ruleName = colonIdx > -1 ? part.slice(0, colonIdx) : part;
                var ruleParam = colonIdx > -1 ? part.slice(colonIdx + 1) : null;

                if (!rules[ruleName]) continue;
                var result = rules[ruleName](val, ruleParam);

                if (result !== true) {
                    showError(field, result);
                    return false;
                }
            }
            clearError(field);
            return true;
        }

        // Validate realtime khi blur (học từ jQuery Validate behavior)
        var fields = form.querySelectorAll('[data-validate]');
        fields.forEach(function (field) {
            field.addEventListener('blur', function () {
                validateField(field);
            });
            field.addEventListener('input', function () {
                if (field.classList.contains('is-invalid')) {
                    validateField(field); // re-validate khi đang có lỗi
                }
            });
        });

        // Submit handler
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var isValid = true;

            fields.forEach(function (field) {
                if (!validateField(field)) isValid = false;
            });

            if (!isValid) {
                var firstError = form.querySelector('.is-invalid');
                if (firstError) firstError.focus();
                return;
            }

            // Nếu valid → gửi form (thay bằng fetch/AJAX tuỳ backend)
            sendFormData(form);
        });
    }

    // Gửi form bằng fetch — thay URL bằng endpoint thực
    function sendFormData(form) {
        var btn = form.querySelector('[type="submit"]');
        var originalText = btn ? btn.innerHTML : '';

        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Đang gửi...';
        }

        var data = new FormData(form);

        // Submit to Web3Forms API
        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: data
        })
            .then(function (res) {
                if (!res.ok) throw new Error('Server error ' + res.status);
                return res.json();
            })
            .then(function (result) {
                if (result.success) {
                    form.reset();
                    form.querySelectorAll('.is-valid').forEach(function (el) {
                        el.classList.remove('is-valid');
                    });
                    
                    form.style.display = 'none';
                    var successDiv = document.getElementById('form-success');
                    if(successDiv) {
                        successDiv.style.display = 'block';
                    } else {
                        showFormSuccess(form, 'Cảm ơn! Chúng tôi sẽ liên hệ lại trong 24 giờ.');
                    }
                } else {
                    throw new Error('API returned un-success');
                }
            })
            .catch(function () {
                showFormSuccess(form, 'Có lỗi khi gửi. Vui lòng gọi trực tiếp: 0913 446 353.', true);
            })
            .finally(function () {
                if (btn) {
                    btn.disabled = false;
                    btn.innerHTML = originalText;
                }
            });
    }

    function showFormSuccess(form, msg, isError) {
        var existing = form.querySelector('.form-feedback-global');
        if (existing) existing.remove();

        var alert = document.createElement('div');
        alert.className = 'alert ' + (isError ? 'alert-danger' : 'alert-success') + ' form-feedback-global mt-3';
        alert.setAttribute('role', 'alert');
        alert.innerHTML = (isError ? '<i class="bi bi-exclamation-triangle-fill me-2"></i>' : '<i class="bi bi-check-circle-fill me-2"></i>') + msg;
        form.appendChild(alert);

        // Tự xóa sau 6 giây
        setTimeout(function () { alert.remove(); }, 6000);
    }


    /* ============================================================
     * 4. TYPED TEXT EFFECT (BONUS)
     * Cách dùng: thêm data-typed='["Cầu đường","Thí nghiệm","Tư vấn"]' vào element
     * Ví dụ: <span id="typedText" data-typed='["Cầu đường","Thí nghiệm"]'></span>
     *
     * Giải thích kỹ thuật:
     *   - Mô phỏng Typed.js (thư viện phổ biến trong senior project)
     *   - Gõ từng ký tự → xóa → gõ từ tiếp theo → loop
     *   - Cursor nhấp nháy = CSS animation
     * ============================================================ */
    function initTypedText() {
        var el = document.querySelector('[data-typed]');
        if (!el) return;

        var words;
        try {
            words = JSON.parse(el.getAttribute('data-typed'));
        } catch (e) {
            return;
        }
        if (!words || !words.length) return;

        var typeDelay = 80;   // ms mỗi ký tự khi gõ
        var deleteDelay = 40; // ms mỗi ký tự khi xóa
        var pauseAfterType = 2000; // ms dừng sau khi gõ xong
        var pauseAfterDelete = 400; // ms dừng trước khi gõ từ tiếp

        var wordIndex = 0;
        var charIndex = 0;
        var isDeleting = false;

        // Tạo cursor
        var cursor = document.createElement('span');
        cursor.className = 'typed-cursor';
        cursor.textContent = '|';
        cursor.style.cssText = 'animation:typed-blink .7s infinite;opacity:1;margin-left:1px;';
        el.parentNode.insertBefore(cursor, el.nextSibling);

        // Inject CSS cho cursor
        if (!document.getElementById('typed-css')) {
            var style = document.createElement('style');
            style.id = 'typed-css';
            style.textContent = '@keyframes typed-blink{0%,100%{opacity:1}50%{opacity:0}}';
            document.head.appendChild(style);
        }

        function type() {
            var currentWord = words[wordIndex % words.length];

            if (isDeleting) {
                charIndex--;
            } else {
                charIndex++;
            }

            el.textContent = currentWord.slice(0, charIndex);

            var delay = isDeleting ? deleteDelay : typeDelay;

            if (!isDeleting && charIndex === currentWord.length) {
                // Vừa gõ xong, dừng rồi xóa
                delay = pauseAfterType;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                // Vừa xóa xong, sang từ tiếp theo
                isDeleting = false;
                wordIndex++;
                delay = pauseAfterDelete;
            }

            setTimeout(type, delay);
        }

        type();
    }


    /* ============================================================
     * INIT — chạy tất cả khi DOM sẵn sàng
     * ============================================================ */
    function init() {
        initCounters();
        initParallax();
        initFormValidation();
        initTypedText();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init(); // DOM đã sẵn sàng
    }

})();