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

    // 1. Add existing students FIRST
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
            <td style="font-weight: 500;">
                ${student}
            </td>
            <td>
                <span class="status-badge ${statusClass}">${status}</span>
            </td>
            <td>
                ${formattedDate}
            </td>
            <td style="color: #64748b; font-size: 0.75rem;">Bachelor's Admission</td>
        `;

        tableBody.appendChild(row);
    }

    // 2. Add 2 Free Slots LAST
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
}
