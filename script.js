// ============================================
// IMPACT ADMISSIONS - APPLICATION LOGIC
// ============================================

// ============================================
// SMOOTH SCROLLING & NAVIGATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initSmoothScrolling();
    initHeaderScroll();
    initMobileMenu();
    initNewsletterForm();
    initRippleEffect();
    initConstructor(); // Initialize constructor immediately
});

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');

            // Skip if it's just "#"
            if (href === '#') {
                e.preventDefault();
                return;
            }

            const target = document.querySelector(href);

            if (target) {
                e.preventDefault();

                // Update active nav link
                document.querySelectorAll('.nav-link').forEach(navLink => {
                    navLink.classList.remove('active');
                });

                if (link.classList.contains('nav-link')) {
                    link.classList.add('active');
                }

                // Scroll to target
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Header scroll effect
function initHeaderScroll() {
    const header = document.querySelector('.header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}

// Mobile menu
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const nav = document.getElementById('nav');

    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', () => {
            nav.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });

        // Close menu when clicking on a link
        const navLinks = nav.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            });
        });
    }
}

// Newsletter form
function initNewsletterForm() {
    const form = document.getElementById('newsletterForm');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const email = form.querySelector('input[type="email"]').value;

            // Show success message (you can replace this with actual form submission)
            alert(`Спасибо за подписку! Мы отправим письмо на ${email}`);

            form.reset();
        });
    }
}

// Ripple effect for buttons
function initRippleEffect() {
    const buttons = document.querySelectorAll('.btn');

    buttons.forEach(button => {
        button.addEventListener('click', function (e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');

            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// ============================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ============================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for fade-in animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.feature-card, .testimonial-card, .timeline-item');

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
});

// ============================================
// MODAL FUNCTIONALITY
// ============================================

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Ensure services are rendered when constructor opens
        if (modalId === 'constructorModal') {
            initConstructor();
        }

        // Ensure diagnostic chart is drawn
        if (modalId === 'diagnosticModal') {
            updateDiagChart();
        }
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function logoutStaff() {
    localStorage.removeItem('impact_staff_authorized');
    window.location.reload();
}

// Close modal on overlay click
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        const modal = e.target.closest('.modal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal.active');
        if (activeModal) {
            activeModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});



// ============================================
// CONSTRUCTOR LOGIC
// ============================================

const servicesData = [
    {
        id: 1,
        name: "Первичная диагностика профиля",
        price15: 3927000,
        price10: 3665200,
        price1: 366520,
        desc: "Глубокий анализ академических данных, внеклассных активностей и потенциала поступления"
    },
    {
        id: 2,
        name: "Встреча с индивидуальным трекером",
        price15: 3927000,
        price10: 3665200,
        price1: 366520,
        desc: "Индивидуальная сессия со специалистом по поступлению, разбор стратегии и рисков"
    },
    {
        id: 3,
        name: "Составление индивидуального плана поступления",
        price15: 3927000,
        price10: 3665200,
        price1: 366520,
        desc: "Пошаговый план подготовки с дедлайнами и рекомендациями под цель"
    },
    {
        id: 4,
        name: "Доступ к LMS и обучающим материалам",
        price15: 3927000,
        price10: 3665200,
        price1: 366520,
        desc: "Онлайн-платформа с курсами, шаблонами, гайдами и проверочными материалами"
    },
    {
        id: 5,
        name: "Развитие внешкольной активности",
        price15: 20616750,
        price10: 19242300,
        price1: 1924230,
        desc: "Проектная деятельность, менторство, усиление профиля под требования топ-вузов"
    },
    {
        id: 6,
        name: "Регистрация на SAT / IELTS",
        price15: 3239775,
        price10: 3023780,
        price1: 302378,
        desc: "Сопровождение регистрации, выбор дат, помощь с оплатой и дедлайнами"
    },
    {
        id: 7,
        name: "Формирование списка университетов",
        price15: 3239775,
        price10: 3023780,
        price1: 302378,
        desc: "Подбор вузов по бюджету, шансам поступления и целям семьи"
    },
    {
        id: 8,
        name: "Подготовка рекомендательных писем",
        price15: 11781000,
        price10: 10995600,
        price1: 1099560,
        desc: "Работа с рекомендателями, структура писем, контроль качества и соответствия требованиям вузов"
    },
    {
        id: 9,
        name: "Мотивационные письма",
        price15: 6479550,
        price10: 6047580,
        price1: 604758,
        desc: "Индивидуальная адаптация мотивационного письма под требования каждого университета"
    },
    {
        id: 10,
        name: "Стандартное заявление",
        price15: 1649340,
        price10: 1539390,
        price1: 153939,
        desc: "Заполнение, проверка и корректировка стандартной формы заявки"
    },
    {
        id: 11,
        name: "Упаковка документов",
        price15: 1237005,
        price10: 1154540,
        price1: 115454,
        desc: "Подготовка, структурирование и загрузка полного пакета документов"
    },
    {
        id: 12,
        name: "Подготовка к интервью",
        price15: 1237005,
        price10: 1154540,
        price1: 115454,
        desc: "Консультация и практическая подготовка к интервью с университетом"
    },
    {
        id: 13,
        name: "После подачи заявлений",
        price15: 1237005,
        price10: 1731807,
        price1: 1731807,
        desc: "Сопровождение абитуриента, ответы на запросы вузов, контроль статуса заявок"
    },
    {
        id: 14,
        name: "После получения предложений",
        price15: 2061675,
        price10: 2886345,
        price1: 2886345,
        desc: "Анализ офферов, помощь в выборе университета и условий обучения"
    },
    {
        id: 15,
        name: "Последняя встреча",
        price15: 824670,
        price10: 1154538,
        price1: 1154538,
        desc: "Финальная консультация и дальнейшие рекомендации по обучению"
    },
    {
        id: 16,
        name: "Профориентация",
        price15: 2250000,
        price10: 2250000,
        price1: 2250000,
        desc: "Диагностика интересов, подбор направления обучения и стратегии поступления"
    }
];

let selectedServices = new Set();
let currentUniversityCount = 15;

function initConstructor() {
    renderServices();
    updatePrices();
}

function adjustUniversityCount(delta) {
    const newCount = currentUniversityCount + delta;
    if (newCount < 5) return; // Minimum 5 colleges

    currentUniversityCount = newCount;
    document.getElementById('uniCountDisplay').textContent = currentUniversityCount;
    updatePrices();
}

function renderServices() {
    const grid = document.getElementById('servicesGrid');
    if (!grid) return;

    grid.innerHTML = servicesData.map(service => `
        <div class="service-item" id="service-${service.id}">
            <div class="service-info">
                <span class="service-name">${service.name}</span>
                <span class="service-desc">${service.desc}</span>
            </div>
            <div class="service-price" data-id="${service.id}">
                ${formatPrice(getServicePrice(service, currentUniversityCount))}
            </div>
            <div class="service-checkbox">
                <div class="custom-checkbox ${selectedServices.has(service.id) ? 'checked' : ''}" 
                     onclick="toggleService(${service.id})"></div>
            </div>
        </div>
    `).join('');
}

function getServicePrice(service, count) {
    // If it's Career Guidance (ID 16), it's always fixed price
    if (service.id === 16) return 2250000;

    // Use price tiers for calculation
    // price1 is the unit price for 1-10 colleges
    // price10 is for 10
    // price15 is for 15

    if (count <= 10) {
        return count * service.price1;
    } else if (count <= 15) {
        // Interpolate between 10 and 15
        const ratio = (count - 10) / 5;
        return service.price10 + ratio * (service.price15 - service.price10);
    } else {
        // For > 15, use the price15 unit rate
        const unitRate15 = service.price15 / 15;
        return count * unitRate15;
    }
}

function formatPrice(price) {
    if (price === 0) return 'Бесплатно';
    return new Intl.NumberFormat('ru-RU').format(Math.round(price)) + ' UZS';
}

function updatePrices() {
    // Update prices in the list
    servicesData.forEach(service => {
        const priceEl = document.querySelector(`.service-price[data-id="${service.id}"]`);
        if (priceEl) {
            priceEl.textContent = formatPrice(getServicePrice(service, currentUniversityCount));
        }
    });

    calculateTotal();
}

function toggleService(id) {
    const service = servicesData.find(s => s.id === id);
    if (!service) return;

    if (selectedServices.has(id)) {
        selectedServices.delete(id);
    } else {
        selectedServices.add(id);
    }

    // Update UI
    const checkbox = document.querySelector(`#service-${id} .custom-checkbox`);
    if (checkbox) {
        checkbox.classList.toggle('checked');
    }

    calculateTotal();
}

function calculateTotal() {
    let total = 0;

    selectedServices.forEach(id => {
        const service = servicesData.find(s => s.id === id);
        if (service) {
            total += getServicePrice(service, currentUniversityCount);
        }
    });

    // Update Summary
    document.getElementById('selectedCount').textContent = selectedServices.size;
    document.getElementById('totalPrice').textContent = formatPrice(total);
}

function resetConstructor() {
    selectedServices.clear();
    const checkboxes = document.querySelectorAll('.custom-checkbox');
    checkboxes.forEach(cb => cb.classList.remove('checked'));
    calculateTotal();
}

function submitOrder() {
    if (selectedServices.size === 0) {
        alert('Пожалуйста, выберите хотя бы одну услугу');
        return;
    }

    const services = Array.from(selectedServices).map(id => {
        const s = servicesData.find(x => x.id === id);
        return s.name;
    }).join(', ');

    const total = document.getElementById('totalPrice').textContent;

    alert(`Спасибо! Ваша заявка сформирована.\n\nПакет: ${currentUniversityCount} университетов\nУслуги: ${services}\nИтого: ${total}\n\nМы свяжемся с вами в ближайшее время.`);
    closeModal('constructorModal');
}

// Intercept clicks on links that point to #constructor
document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href="#constructor"]');
    if (link) {
        e.preventDefault();
        openModal('constructorModal');
    }
});

// ============================================
// DOCUMENT VIEWER LOGIC
// ============================================

async function openDocumentModal(filePath) {
    const modal = document.getElementById('documentModal');
    const container = document.getElementById('documentContainer');
    const titleEl = document.getElementById('docTitle');
    const downloadBtn = document.getElementById('docDownloadBtn');

    if (!modal || !container) return;

    // Set title based on filename
    const filename = filePath.split('/').pop().replace('.docx', '');
    titleEl.textContent = decodeURIComponent(filename);

    // Update download button
    downloadBtn.href = filePath;

    // Show modal and loading state
    openModal('documentModal');
    container.innerHTML = '<div class="doc-loading">Загрузка документа...</div>';

    try {
        // Encode path to handle spaces/special chars
        const encodedPath = filePath.split('/').map(part => encodeURIComponent(part)).join('/');

        console.log('Attempting to fetch:', encodedPath);
        const response = await fetch(encodedPath);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const blob = await response.blob();

        // Clear loading and render
        container.innerHTML = '';

        // Render DOCX using docx-preview
        await docx.renderAsync(blob, container, null, {
            className: 'docx-viewer',
            inWrapper: false,
            ignoreWidth: false,
            ignoreHeight: false,
            breakPages: true
        });

    } catch (error) {
        console.error('Error loading document:', error);

        let errorMessage = 'Не удалось загрузить документ.';
        let errorDetail = 'Возможно, файл был перемещен или удален.';

        // Check for file protocol block
        if (window.location.protocol === 'file:') {
            errorMessage = 'Браузер заблокировал загрузку файла.';
            errorDetail = 'Из-за настроек безопасности браузера, просмотр документов работает только на локальном сервере (Live Server) или хостинге. В этом режиме доступно только скачивание.';
        }

        container.innerHTML = `
            <div class="doc-loading" style="color: var(--color-error)">
                <p style="font-weight: bold; margin-bottom: 10px;">${errorMessage}</p>
                <p style="font-size: 0.9rem; margin-bottom: 20px; max-width: 400px; margin-left: auto; margin-right: auto;">${errorDetail}</p>
                <a href="${filePath}" class="btn btn-primary" download>Скачать вместо просмотра</a>
            </div>
        `;
    }
}

// ============================================
// IMAGE MODAL LOGIC
// ============================================

function openImageModal(src) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    if (!modal || !modalImg) return;

    modalImg.src = src;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

function closeImageModal() {
    const modal = document.getElementById('imageModal');
    if (!modal) return;

    modal.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
}

// Close image modal on Esc key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeImageModal();
        closeVideoModal();
    }
});

// ============================================
// VIDEO MODAL LOGIC
// ============================================

function openVideoModal(videoSource) {
    const modal = document.getElementById('videoModal');
    const container = document.getElementById('videoPlayerContainer');
    if (!modal || !container) return;

    let videoHtml = '';

    // Check if it's a YouTube ID or a link
    if (videoSource.includes('youtube.com') || videoSource.includes('youtu.be') || videoSource.length < 15) {
        // Extract ID if it's a link
        const videoId = videoSource.includes('v=') ? videoSource.split('v=')[1].split('&')[0] :
            videoSource.includes('youtu.be/') ? videoSource.split('youtu.be/')[1] : videoSource;

        videoHtml = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
    } else {
        // Direct file link
        videoHtml = `<video src="${videoSource}" controls autoplay></video>`;
    }

    container.innerHTML = videoHtml;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function openEnrollmentModal() {
    const modal = document.getElementById('enrollmentModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        initEnrollmentTable();
    }
}

function closeEnrollmentModal() {
    const modal = document.getElementById('enrollmentModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function initEnrollmentTable() {
    const tableBody = document.getElementById('enrollmentBody');
    if (!tableBody) return;

    const studentNames = [
        "Абдужабборов Жамшидбек", "Закирова Самина", "Саидахмедов Жахонгир",
        "Эркабоева Гулноза", "Ибрагимов Нариманбек", "Рустамбеков Азизбек",
        "Алижон Джуманов", "Очилова Умида", "Гулямова Сайёда",
        "Марупов Амирхон", "Олимхонова Дилрабо", "Исмогилова Мунисахон",
        "Халилов Алижон"
    ];

    const today = new Date();
    const todayFormatted = today.toISOString().split('T')[0];

    tableBody.innerHTML = '';
    let rowIndex = 1;

    // 1. Add 2 Free Slots (Fully Editable)
    for (let i = 0; i < 2; i++) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td style="text-align: center; color: #94a3b8;">${rowIndex++}</td>
            <td contenteditable="true" class="editable-cell name-input" data-placeholder="Введите ФИО...">
                <div class="slot-free">Свободное место</div>
            </td>
            <td>
                <select class="excel-select status-select">
                    <option value="status-slot" selected>ДОСТУПНО</option>
                    <option value="status-prepaid">ПРЕДОПЛАТА</option>
                    <option value="status-active">АКТИВНЫЙ</option>
                </select>
            </td>
            <td>
                <input type="date" class="excel-date-input" value="${todayFormatted}">
            </td>
            <td contenteditable="true" class="editable-cell" style="color: #64748b; font-size: 0.75rem;">Bachelor's Admission</td>
        `;

        // Clear placeholder text on first edit
        const nameCell = row.querySelector('.name-input');
        nameCell.addEventListener('focus', function () {
            if (this.innerText.includes('Свободное место')) {
                this.innerHTML = '';
            }
        });

        tableBody.appendChild(row);
    }

    // 2. Add existing students
    for (let i = 0; i < studentNames.length; i++) {
        const date = new Date();
        date.setDate(today.getDate() - (i + 1));

        const formattedDate = date.toLocaleDateString('ru-RU', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric'
        });

        const student = studentNames[i];

        let status = "АКТИВНЫЙ";
        let statusClass = "status-active";

        if (i < 2) {
            status = "ПРЕДОПЛАТА";
            statusClass = "status-prepaid";
        }

        const row = document.createElement('tr');
        row.innerHTML = `
            <td style="text-align: center; color: #94a3b8;">${rowIndex++}</td>
            <td style="font-weight: 500;">${student}</td>
            <td><span class="status-badge ${statusClass}">${status}</span></td>
            <td>${formattedDate}</td>
            <td style="color: #64748b; font-size: 0.75rem;">Bachelor's Admission</td>
        `;
        tableBody.appendChild(row);
    }
}

// ============================================
// STAFF AUTHORIZATION LOGIC
// ============================================

const STAFF_PASS = 'Impact2025!';

function checkStaffAccess() {
    const input = document.getElementById('staffPassword');
    const error = document.getElementById('authError');
    const overlay = document.getElementById('staffAuthOverlay');

    if (input.value === STAFF_PASS) {
        localStorage.setItem('impact_staff_authorized', 'true');
        overlay.classList.add('hidden');
        document.body.classList.remove('staff-protected');
        document.body.classList.add('authorized');
        error.style.display = 'none';

        // Re-init any observers or animations if needed
        initAOS();
    } else {
        error.style.display = 'block';
        input.value = '';
        input.focus();
    }
}

function initAOS() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
}

// ============================================
// DIAGNOSTIC TOOL LOGIC
// ============================================

function updateDiagChart() {
    const selects = document.querySelectorAll('.diag-rating-select');
    const values = [];

    selects.forEach(select => {
        const rating = parseInt(select.value);
        values.push(rating);
        const card = select.closest('.comp-card');
        if (card) {
            const levels = card.querySelectorAll('.level');
            levels.forEach(lv => lv.classList.remove('active'));
            const targetLevel = card.querySelector(`.lv-${7 - rating}`);
            if (targetLevel) targetLevel.classList.add('active');
        }
    });

    drawRadarChart(values);
}

function drawRadarChart(values) {
    const container = document.querySelector('.diag-chart-container');
    if (!container) return;

    const size = 300;
    const center = size / 2;
    const radius = size * 0.4;
    const labels = ['Acad', 'Extra', 'Intel', 'Essay', 'Recs', 'EQ'];

    let axesHtml = '';
    let circlesHtml = '';

    // Draw 6 radial circles (levels 1-6)
    for (let i = 1; i <= 6; i++) {
        const r = (radius / 6) * i;
        circlesHtml += `<circle cx="${center}" cy="${center}" r="${r}" fill="none" stroke="#e2e8f0" stroke-width="1" />`;
    }

    // Draw axes and calculate points
    const points = [];
    for (let i = 0; i < 6; i++) {
        const angle = (Math.PI * 2 / 6) * i - Math.PI / 2;
        const x = center + radius * Math.cos(angle);
        const y = center + radius * Math.sin(angle);
        axesHtml += `<line x1="${center}" y1="${center}" x2="${x}" y2="${y}" stroke="#e2e8f0" stroke-width="1" />`;

        // Value point (rating 6 is max, maps to radius)
        const valR = (radius / 6) * values[i];
        const valX = center + valR * Math.cos(angle);
        const valY = center + valR * Math.sin(angle);
        points.push(`${valX},${valY}`);

        // Label
        const labelX = center + (radius + 20) * Math.cos(angle);
        const labelY = center + (radius + 20) * Math.sin(angle);
        axesHtml += `<text x="${labelX}" y="${labelY}" text-anchor="middle" font-size="10" fill="#64748b" dominant-baseline="middle">${labels[i]}</text>`;
    }

    const polygonHtml = `<polygon points="${points.join(' ')}" fill="rgba(59, 130, 246, 0.2)" stroke="#3b82f6" stroke-width="2" />`;

    container.innerHTML = `
        <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
            ${circlesHtml}
            ${axesHtml}
            ${polygonHtml}
        </svg>
    `;
}

function toggleInst(el) {
    el.classList.toggle('checked');
}

function calcDiagTotal() {
    const costCells = document.querySelectorAll('.cost-val');
    let total = 0;
    costCells.forEach(cell => {
        const val = parseFloat(cell.innerText) || 0;
        total += val;
    });

    const uniCount = parseInt(document.getElementById('diagUniCount').value) || 1;
    const avg = total / uniCount;

    document.getElementById('diagTotalDisplay').innerText = `$${total.toFixed(2)}`;
    document.getElementById('diagAvgDisplay').innerText = `$${avg.toFixed(2)}`;
}

function populateDiagTables() {
    // Populate University List (8 rows)
    const uniBody = document.getElementById('diagUniBody');
    if (uniBody && uniBody.children.length === 0) {
        for (let i = 0; i < 8; i++) {
            const row = document.createElement('tr');
            row.innerHTML = `<td contenteditable="true"></td><td contenteditable="true"></td>`;
            uniBody.appendChild(row);
        }
    }

    // Populate Roadmap (10 priorities)
    const roadmapBody = document.getElementById('diagRoadmapBody');
    if (roadmapBody && roadmapBody.children.length === 0) {
        for (let i = 1; i <= 10; i++) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><div class="priority-num">${i}</div></td>
                <td contenteditable="true"></td>
                <td contenteditable="true" class="deadline-cell"></td>
            `;
            roadmapBody.appendChild(row);
        }
    }
}

function exportDiag(e) {
    if (typeof html2pdf === 'undefined') {
        alert('Библиотека для создания PDF еще загружается или заблокирована. Пожалуйста, подождите 5 секунд или используйте стандартную печать (Cmd+P / Ctrl+P).');
        window.print();
        return;
    }

    const element = document.querySelector('.diagnostic-container');
    const studentName = document.querySelector('.diag-field input[type="text"]').value || 'Student';
    const exportBtn = e ? e.currentTarget : document.querySelector('.btn-secondary');
    const originalBtnText = exportBtn.innerText;

    // Show loading state
    exportBtn.innerText = 'Генерация...';
    exportBtn.disabled = true;
    exportBtn.style.opacity = '0.7';

    // Hide UI elements during capture
    const footer = document.querySelector('.diag-footer');
    const closeBtn = document.querySelector('.diag-close');

    // Create a temporary container to fix overflow/scroll issues for html2canvas
    const opt = {
        margin: [10, 5, 10, 5], // Top, Left, Bottom, Right
        filename: `Impact_Diagnostic_${studentName}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
            scale: 2,
            useCORS: true,
            scrollY: 0,
            scrollX: 0,
            windowWidth: 1200 // Force a desktop-like width for rendering
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    // Use a promise to handle restoration correctly
    html2pdf().set(opt).from(element).toPdf().get('pdf').then(function (pdf) {
        // You could do additional PDF manipulation here if needed
    }).save().then(() => {
        // Restore UI
        exportBtn.innerText = originalBtnText;
        exportBtn.disabled = false;
        exportBtn.style.opacity = '1';
    }).catch(err => {
        console.error('PDF Export Error:', err);
        exportBtn.innerText = originalBtnText;
        exportBtn.disabled = false;
        exportBtn.style.opacity = '1';
        alert('Не удалось автоматически скачать файл. Открываю окно печати - выберите "Сохранить как PDF".');
        window.print();
    });
}

// Ensure Diagnostic Tool is initialized if opened
document.addEventListener('DOMContentLoaded', () => {
    // Populate static rows
    populateDiagTables();
    calcDiagTotal();
    updateDiagChart();
});

// Call on load
document.addEventListener('DOMContentLoaded', () => {
    // Auth Check
    const isAuth = localStorage.getItem('impact_staff_authorized');
    const overlay = document.getElementById('staffAuthOverlay');

    if (isAuth === 'true') {
        if (overlay) overlay.classList.add('hidden');
        document.body.classList.remove('staff-protected');
        document.body.classList.add('authorized');
    }

    // Other initializations
    // initEnrollmentTable(); // Only if we want it pre-filled
});
