// ============================================
// CONSTRUCTOR LOGIC
// ============================================

let currentConstructorStep = 1;
const totalConstructorSteps = 3;
let selectedServices = [];
let selectedGoal = 'undergraduate';

// Goal names mapping
const goalNames = {
    undergraduate: 'Undergraduate',
    master: 'Master\'s',
    mba: 'MBA',
    ivyleague: 'Ivy League',
    uk: 'UK Universities',
    phd: 'PhD'
};

// Service names mapping
const serviceNames = {
    strategy: 'Стратегия поступления',
    universities: 'Подбор университетов',
    documents: 'Подготовка документов',
    essay: 'Написание эссе',
    recommendations: 'Рекомендательные письма',
    interview: 'Подготовка к интервью',
    testing: 'Подготовка к тестам',
    support: 'Полное сопровождение'
};

document.addEventListener('DOMContentLoaded', () => {
    initConstructor();
});

function initConstructor() {
    // Goal selection
    const goalInputs = document.querySelectorAll('input[name="goal"]');
    goalInputs.forEach(input => {
        input.addEventListener('change', (e) => {
            selectedGoal = e.target.value;
            updateSummary();
        });
    });

    // Service selection
    const serviceInputs = document.querySelectorAll('input[name="service"]');
    serviceInputs.forEach(input => {
        input.addEventListener('change', (e) => {
            updateSelectedServices();
            updateSummary();
        });
    });

    // Form submission
    const form = document.getElementById('constructorForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }

    // Initialize summary
    updateSummary();
}

function nextStep() {
    if (currentConstructorStep < totalConstructorSteps) {
        // Validation
        if (currentConstructorStep === 1) {
            const selectedGoalInput = document.querySelector('input[name="goal"]:checked');
            if (!selectedGoalInput) {
                alert('Пожалуйста, выберите цель поступления');
                return;
            }
        }

        if (currentConstructorStep === 2) {
            const selectedServices = document.querySelectorAll('input[name="service"]:checked');
            if (selectedServices.length === 0) {
                alert('Пожалуйста, выберите хотя бы одну услугу');
                return;
            }
        }

        currentConstructorStep++;
        showConstructorStep(currentConstructorStep);
    }
}

function prevStep() {
    if (currentConstructorStep > 1) {
        currentConstructorStep--;
        showConstructorStep(currentConstructorStep);
    }
}

function showConstructorStep(step) {
    // Hide all steps
    const steps = document.querySelectorAll('.constructor-step');
    steps.forEach(stepEl => {
        stepEl.classList.remove('active');
    });

    // Show current step
    const currentStepEl = document.getElementById(`step${step}`);
    if (currentStepEl) {
        currentStepEl.classList.add('active');
    }

    // Update header
    const titles = [
        'Шаг 1: Выберите цель поступления',
        'Шаг 2: Выберите услуги',
        'Шаг 3: Контактная информация'
    ];

    const headerTitle = document.querySelector('.constructor-title');
    if (headerTitle) {
        headerTitle.textContent = titles[step - 1];
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateSelectedServices() {
    selectedServices = [];
    const serviceInputs = document.querySelectorAll('input[name="service"]:checked');

    serviceInputs.forEach(input => {
        const service = {
            id: input.value,
            name: serviceNames[input.value] || input.value,
            price: parseInt(input.dataset.price) || 0
        };
        selectedServices.push(service);
    });
}

function updateSummary() {
    // Update goal
    const summaryGoalValue = document.querySelector('.summary-value');
    if (summaryGoalValue) {
        summaryGoalValue.textContent = goalNames[selectedGoal] || selectedGoal;
    }

    // Update services
    const summaryServices = document.getElementById('summaryServices');
    if (summaryServices) {
        // Clear previous
        const existingItems = summaryServices.querySelectorAll('.summary-service-item, .summary-empty');
        existingItems.forEach(item => item.remove());

        if (selectedServices.length === 0) {
            const emptyDiv = document.createElement('div');
            emptyDiv.className = 'summary-empty';
            emptyDiv.textContent = 'Услуги не выбраны';
            summaryServices.appendChild(emptyDiv);
        } else {
            selectedServices.forEach(service => {
                const serviceItem = document.createElement('div');
                serviceItem.className = 'summary-service-item';
                serviceItem.innerHTML = `
                    <span class="summary-service-name">${service.name}</span>
                    <span class="summary-service-price">${formatPrice(service.price)}</span>
                `;
                summaryServices.appendChild(serviceItem);
            });
        }
    }

    // Update total price
    const totalPrice = selectedServices.reduce((sum, service) => sum + service.price, 0);
    const totalPriceEl = document.getElementById('totalPrice');
    if (totalPriceEl) {
        totalPriceEl.textContent = formatPrice(totalPrice);
    }
}

function formatPrice(price) {
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        maximumFractionDigits: 0
    }).format(price);
}

function handleFormSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        country: formData.get('country'),
        comment: formData.get('comment'),
        goal: selectedGoal,
        services: selectedServices,
        totalPrice: selectedServices.reduce((sum, service) => sum + service.price, 0)
    };

    console.log('Form submitted:', data);

    // Show success message
    alert(`Спасибо за заявку! Мы свяжемся с вами в ближайшее время.\n\nВыбранные услуги: ${selectedServices.map(s => s.name).join(', ')}\nИтого: ${formatPrice(data.totalPrice)}`);

    // Reset form and constructor
    e.target.reset();
    currentConstructorStep = 1;
    selectedServices = [];
    selectedGoal = 'undergraduate';

    // Uncheck all services
    document.querySelectorAll('input[name="service"]').forEach(input => {
        input.checked = false;
    });

    showConstructorStep(1);
    updateSummary();
}

// Make functions global
window.nextStep = nextStep;
window.prevStep = prevStep;
