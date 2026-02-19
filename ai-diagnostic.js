// ============================================
// AI-POWERED DIAGNOSTIC GENERATION
// ============================================

/**
 * AI Diagnostic Assistant
 * Автоматически генерирует:
 * - Комментарии трекера
 * - Список университетов
 * - Дорожную карту с приоритетами
 * - Рекомендации по инструментам
 */

// Конфигурация API (можно использовать OpenAI, Anthropic, или локальный сервер)
const AI_CONFIG = {
    // Вариант 1: OpenAI API
    provider: 'openai', // 'openai' | 'anthropic' | 'local'
    apiKey: '', // Установите в .env или через настройки
    model: 'gpt-4o-mini', // Быстрая, дешевая и умная модель (доступна всем)
    baseURL: 'https://api.openai.com/v1',

    // Вариант 2: Anthropic Claude
    // provider: 'anthropic',
    // apiKey: '',
    // model: 'claude-3-opus-20240229',
    // baseURL: 'https://api.anthropic.com/v1',

    // Вариант 3: Локальный сервер (Ollama, LM Studio и т.д.)
    // provider: 'local',
    // baseURL: 'http://localhost:11434/v1', // Ollama
};

// Пытаемся загрузить сохраненный ключ
const savedKey = localStorage.getItem('openai_api_key');
if (savedKey) {
    AI_CONFIG.apiKey = savedKey;
    console.log('🔑 API ключ загружен из хранилища');
}

// Кэш для избежания повторных запросов
const aiCache = new Map();

/**
 * Собирает все данные из формы диагностики
 */
function collectDiagnosticData() {
    const data = {
        // Базовая информация
        name: document.querySelector('.intro-section input[placeholder="Введите ФИО"]')?.value || '',
        school: document.querySelector('.intro-section input[placeholder="Учебное заведение"]')?.value || '',
        budget: {
            amount: document.querySelector('.intro-section input[type="number"]')?.value || '',
            currency: document.querySelector('.intro-section select')?.value || '$'
        },
        achievements: Array.from(document.querySelectorAll('.diag-achievements input'))
            .map(input => input.value)
            .filter(v => v.trim()),
        questions: document.querySelector('.intro-section textarea')?.value || '',

        // Рейтинги компетенций
        ratings: {
            academic: parseInt(document.querySelector('[data-comp="academic"] .diag-rating-select')?.value || '3'),
            extracurricular: parseInt(document.querySelector('[data-comp="extra"] .diag-rating-select')?.value || '3'),
            intellectual: parseInt(document.querySelector('[data-comp="intellect"] .diag-rating-select')?.value || '3'),
            essay: parseInt(document.querySelector('[data-comp="essay"] .diag-rating-select')?.value || '3'),
            recommendations: parseInt(document.querySelector('[data-comp="recs"] .diag-rating-select')?.value || '3'),
            eq: parseInt(document.querySelector('[data-comp="eq"] .diag-rating-select')?.value || '3')
        },

        // Финансовые данные
        uniCount: parseInt(document.getElementById('diagUniCount')?.value || '5'),
        costs: Array.from(document.querySelectorAll('#diagCostsBody tr')).map(row => ({
            item: row.querySelector('td:first-child')?.innerText || '',
            amount: parseFloat(row.querySelector('.cost-val')?.innerText || '0')
        }))
    };

    return data;
}

/**
 * Создает промпт для ИИ на основе данных студента
 */
function createAIPrompt(data) {
    const ratingsText = `
Academic: ${data.ratings.academic}/6
Extracurricular: ${data.ratings.extracurricular}/6
Intellectual Vitality: ${data.ratings.intellectual}/6
Essay Writing: ${data.ratings.essay}/6
Recommendations: ${data.ratings.recommendations}/6
Emotional Intelligence: ${data.ratings.eq}/6
    `.trim();

    return `Ты - опытный консультант по поступлению в зарубежные университеты. Проанализируй профиль студента и создай персонализированную диагностику.

СТУДЕНТ:
- Имя: ${data.name}
- Школа: ${data.school}
- Бюджет: ${data.budget.amount} ${data.budget.currency}
- Достижения: ${data.achievements.join(', ') || 'Не указаны'}
- Вопросы: ${data.questions || 'Нет'}

РЕЙТИНГИ КОМПЕТЕНЦИЙ (1-6, где 6 - самый низкий, 1 - самый высокий):
${ratingsText}

ЗАДАЧА:
Создай детальную диагностику в формате JSON со следующими разделами:

1. "tracker_comments" - Общий вывод по профилю (2-3 абзаца на русском языке). Укажи сильные стороны, слабые места, потенциал и рекомендации.

2. "universities" - Массив из 8 университетов в формате:
   [
     {"name": "Название университета", "country": "Страна"},
     ...
   ]
   Подбери университеты разных стран (США, Великобритания, Канада, Европа, Азия), учитывая профиль студента, бюджет и рейтинги.

3. "roadmap" - Массив приоритетных задач в формате:
   [
     {"priority": 1, "task": "Описание задачи", "deadline": "DD.MM.YYYY"},
     ...
   ]
   Создай 8-10 задач с конкретными дедлайнами на ближайшие 6-12 месяцев. Задачи должны быть специфичными и измеримыми.

4. "instrument_recommendations" - Массив рекомендуемых инструментов развития (названия из существующего списка):
   [
     "Choice of Universities",
     "Personal Statement",
     ...
   ]
   Выбери 5-7 наиболее важных инструментов на основе профиля.

Верни ТОЛЬКО валидный JSON, без дополнительного текста.`;
}

/**
 * Вызывает ИИ API для генерации диагностики
 */
async function callAIAPI(prompt) {
    const cacheKey = prompt.substring(0, 200); // Кэш по началу промпта

    if (aiCache.has(cacheKey)) {
        console.log('Using cached AI response');
        return aiCache.get(cacheKey);
    }

    try {
        let response;

        if (AI_CONFIG.provider === 'openai') {
            response = await fetchOpenAI(prompt);
        } else if (AI_CONFIG.provider === 'anthropic') {
            response = await fetchAnthropic(prompt);
        } else if (AI_CONFIG.provider === 'local') {
            response = await fetchLocal(prompt);
        } else {
            throw new Error('Неизвестный провайдер ИИ');
        }

        aiCache.set(cacheKey, response);
        return response;

    } catch (error) {
        console.error('AI API Error:', error);
        throw error;
    }
}

/**
 * Запрос к OpenAI API
 */
async function fetchOpenAI(prompt) {
    if (!AI_CONFIG.apiKey) {
        throw new Error('OpenAI API ключ не установлен. Установите AI_CONFIG.apiKey');
    }

    const response = await fetch(`${AI_CONFIG.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${AI_CONFIG.apiKey}`
        },
        body: JSON.stringify({
            model: AI_CONFIG.model,
            messages: [
                {
                    role: 'system',
                    content: 'Ты опытный консультант по поступлению в зарубежные университеты. Всегда отвечай валидным JSON.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 2000
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(`OpenAI API Error: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Извлекаем JSON из ответа (на случай если ИИ добавил текст)
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
    }

    return JSON.parse(content);
}

/**
 * Запрос к Anthropic Claude API
 */
async function fetchAnthropic(prompt) {
    if (!AI_CONFIG.apiKey) {
        throw new Error('Anthropic API ключ не установлен');
    }

    const response = await fetch(`${AI_CONFIG.baseURL}/messages`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': AI_CONFIG.apiKey,
            'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
            model: AI_CONFIG.model,
            max_tokens: 2000,
            messages: [
                {
                    role: 'user',
                    content: prompt
                }
            ]
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(`Anthropic API Error: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const content = data.content[0].text;

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
    }

    return JSON.parse(content);
}

/**
 * Запрос к локальному API (Ollama, LM Studio и т.д.)
 */
async function fetchLocal(prompt) {
    const response = await fetch(`${AI_CONFIG.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'llama2', // или другая модель
            messages: [
                {
                    role: 'user',
                    content: prompt
                }
            ],
            stream: false
        })
    });

    if (!response.ok) {
        throw new Error(`Local API Error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
    }

    return JSON.parse(content);
}

/**
 * Применяет сгенерированные данные к форме
 */
function applyAIGeneratedData(aiData) {
    // 1. Комментарии трекера
    const trackerComments = document.querySelector('.diag-recap textarea');
    const chartSection = document.querySelector('.chart-section');
    if (trackerComments && aiData.tracker_comments) {
        trackerComments.value = aiData.tracker_comments;
        // Триггерим событие изменения для обновления UI
        trackerComments.dispatchEvent(new Event('input', { bubbles: true }));
        // Помечаем секцию как сгенерированную ИИ
        if (chartSection) {
            chartSection.setAttribute('data-ai-generated', 'true');
        }
    }

    // 2. Список университетов
    const uniBody = document.getElementById('diagUniBody');
    const uniSection = document.querySelector('.uni-list-section');
    if (uniBody && aiData.universities && Array.isArray(aiData.universities)) {
        uniBody.innerHTML = '';
        aiData.universities.slice(0, 8).forEach(uni => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td contenteditable="true">${escapeHtml(uni.name || '')}</td>
                <td contenteditable="true">${escapeHtml(uni.country || '')}</td>
            `;
            uniBody.appendChild(row);
        });
        // Помечаем секцию как сгенерированную ИИ
        if (uniSection) {
            uniSection.setAttribute('data-ai-generated', 'true');
        }
    }

    // 3. Дорожная карта
    const roadmapBody = document.getElementById('diagRoadmapBody');
    const roadmapSection = document.querySelector('.roadmap-section');
    if (roadmapBody && aiData.roadmap && Array.isArray(aiData.roadmap)) {
        roadmapBody.innerHTML = '';
        aiData.roadmap.slice(0, 10).forEach((item, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><div class="priority-num">${item.priority || index + 1}</div></td>
                <td contenteditable="true">${escapeHtml(item.task || '')}</td>
                <td contenteditable="true" class="deadline-cell">${escapeHtml(item.deadline || '')}</td>
            `;
            roadmapBody.appendChild(row);
        });
        // Помечаем секцию как сгенерированную ИИ
        if (roadmapSection) {
            roadmapSection.setAttribute('data-ai-generated', 'true');
        }
    }

    // 4. Рекомендации по инструментам
    const instrumentsSection = document.querySelector('.instruments-section');
    if (aiData.instrument_recommendations && Array.isArray(aiData.instrument_recommendations)) {
        // Сначала снимаем все отметки
        document.querySelectorAll('.inst-item').forEach(item => {
            item.classList.remove('checked');
        });

        // Отмечаем рекомендуемые инструменты
        aiData.instrument_recommendations.forEach(instName => {
            const items = Array.from(document.querySelectorAll('.inst-item'));
            const found = items.find(item =>
                item.textContent.trim().toLowerCase().includes(instName.toLowerCase())
            );
            if (found) {
                found.classList.add('checked');
            }
        });
        // Помечаем секцию как сгенерированную ИИ
        if (instrumentsSection) {
            instrumentsSection.setAttribute('data-ai-generated', 'true');
        }
    }

    // Обновляем график после изменений
    if (typeof updateDiagChart === 'function') {
        updateDiagChart();
    }
}

/**
 * Экранирует HTML для безопасности
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Главная функция генерации диагностики с ИИ
 */
async function generateDiagnosticWithAI() {
    const button = document.getElementById('aiGenerateBtn');
    const statusDiv = document.getElementById('aiStatus');

    // Проверка конфигурации и запрос ключа
    if (!AI_CONFIG.apiKey && AI_CONFIG.provider !== 'local') {
        // Пробуем запросить у пользователя
        const userKey = prompt('Для работы ИИ-диагностики требуется OpenAI API Key.\n\nПожалуйста, введите ваш ключ (sk-...):\n(Он будет сохранен только в вашем браузере)');

        if (userKey && userKey.trim().startsWith('sk-')) {
            AI_CONFIG.apiKey = userKey.trim();
            localStorage.setItem('openai_api_key', AI_CONFIG.apiKey);
            alert('Ключ сохранен! Начинаем генерацию...');
        } else {
            showAIError('API ключ не установлен. Пожалуйста, введите корректный ключ OpenAI (начинается с sk-).');
            return;
        }
    }

    // Собираем данные
    const diagnosticData = collectDiagnosticData();

    // Валидация минимальных данных
    if (!diagnosticData.name || !diagnosticData.school) {
        showAIError('Пожалуйста, заполните хотя бы имя и школу для генерации диагностики');
        return;
    }

    // Показываем индикатор загрузки
    if (button) {
        button.disabled = true;
        button.innerHTML = '<span class="ai-loading-spinner"></span> Генерация...';
    }

    if (statusDiv) {
        statusDiv.innerHTML = '<div class="ai-status-info">🤖 ИИ анализирует профиль студента...</div>';
        statusDiv.style.display = 'block';
    }

    try {
        // Создаем промпт
        const prompt = createAIPrompt(diagnosticData);

        // Вызываем ИИ
        const aiResponse = await callAIAPI(prompt);

        // Применяем результаты
        applyAIGeneratedData(aiResponse);

        // Показываем успех
        if (statusDiv) {
            statusDiv.innerHTML = '<div class="ai-status-success">✅ Диагностика успешно сгенерирована! Проверьте и отредактируйте при необходимости.</div>';
            setTimeout(() => {
                statusDiv.style.display = 'none';
            }, 5000);
        }

        // Прокручиваем к первому сгенерированному разделу
        const firstSection = document.querySelector('.chart-section');
        if (firstSection) {
            firstSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

    } catch (error) {
        console.error('AI Generation Error:', error);
        showAIError(`Ошибка генерации: ${error.message}`);
    } finally {
        if (button) {
            button.disabled = false;
            button.innerHTML = '🤖 Сгенерировать с ИИ';
        }
    }
}

/**
 * Показывает ошибку ИИ
 */
function showAIError(message) {
    const statusDiv = document.getElementById('aiStatus');
    if (statusDiv) {
        statusDiv.innerHTML = `<div class="ai-status-error">❌ ${message}</div>`;
        statusDiv.style.display = 'block';
    }

    // Также показываем alert для критических ошибок
    alert(`Ошибка ИИ: ${message}`);
}

/**
 * Инициализация ИИ функционала
 */
function initAIDiagnostic() {
    console.log('🔍 Инициализация ИИ диагностики...');

    // Проверяем наличие кнопки (она должна быть добавлена в HTML)
    const button = document.getElementById('aiGenerateBtn');
    if (button) {
        console.log('✅ Кнопка ИИ найдена');

        // Удаляем все старые обработчики
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);

        // Добавляем новый обработчик
        newButton.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🚀 Запуск генерации ИИ...');
            generateDiagnosticWithAI();
        });

        console.log('✅ Обработчик события добавлен');
    } else {
        console.error('❌ Кнопка ИИ не найдена! Проверьте HTML.');
        return false;
    }

    // Проверяем наличие статус-бара
    const statusBar = document.getElementById('aiStatus');
    if (!statusBar) {
        console.warn('⚠️ Статус-бар ИИ не найден');
    }

    // Добавляем обработчик для настроек
    const settingsBtn = document.getElementById('aiSettingsBtn');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const currentKey = localStorage.getItem('openai_api_key') || '';
            const newKey = prompt('Введите ваш OpenAI API Key:', currentKey);

            if (newKey !== null) {
                localStorage.setItem('openai_api_key', newKey.trim());
                AI_CONFIG.apiKey = newKey.trim();
                alert('API ключ сохранен! Теперь вы можете использовать ИИ генерацию.');
            }
        });
    }

    return true;
}

/**
 * Сохраняет черновик диагностики
 */
function saveDiagnosticDraft() {
    const data = collectDiagnosticData();
    localStorage.setItem('diagnostic_draft', JSON.stringify(data));
}

/**
 * Загружает черновик диагностики
 */
function loadDiagnosticDraft() {
    const draft = localStorage.getItem('diagnostic_draft');
    if (draft) {
        try {
            const data = JSON.parse(draft);
            // Можно восстановить данные в форму
            console.log('Draft loaded:', data);
        } catch (e) {
            console.error('Error loading draft:', e);
        }
    }
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    // Инициализируем сразу, если элементы уже есть
    if (document.getElementById('aiGenerateBtn')) {
        initAIDiagnostic();
    }
    loadDiagnosticDraft();

    // Добавляем обработчик для автосохранения при редактировании (один раз)
    if (!document.hasAttribute('data-ai-save-listener')) {
        document.addEventListener('input', (e) => {
            if (e.target.closest('.diag-section')) {
                saveDiagnosticDraft();
            }
        });
        document.setAttribute('data-ai-save-listener', 'true');
    }
});

// Также инициализируем при открытии модального окна
// Используем более надежный способ - перехватываем открытие модального окна
(function () {
    const originalOpenModal = window.openModal;
    if (originalOpenModal) {
        window.openModal = function (modalId) {
            originalOpenModal.apply(this, arguments);

            // Если открывается диагностика, инициализируем ИИ
            if (modalId === 'diagnosticModal') {
                // Даем время DOM обновиться
                setTimeout(() => {
                    const button = document.getElementById('aiGenerateBtn');
                    if (button && !button.hasAttribute('data-ai-bound')) {
                        initAIDiagnostic();
                        button.setAttribute('data-ai-bound', 'true');
                    }
                }, 150);
            }
        };
    }
})();

// Экспорт функций для глобального использования
window.generateDiagnosticWithAI = generateDiagnosticWithAI;
window.initAIDiagnostic = initAIDiagnostic;
window.AI_CONFIG = AI_CONFIG; // Для настройки из консоли

// Глобальная функция для ручной инициализации (можно вызвать из консоли для отладки)
window.initAI = function () {
    console.log('🔧 Ручная инициализация ИИ...');
    return initAIDiagnostic();
};
