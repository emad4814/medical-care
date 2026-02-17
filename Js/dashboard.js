let appointmentsChartInstance = null;
let departmentsChartInstance = null;

function getCurrentLanguage() {
    return document.documentElement.lang || localStorage.getItem('lang') || 'ar';
}




function getLocaleForCurrentLanguage() {
    switch (currentLang) {
        case "en":
            return "en-US";
        case "fr":
            return "fr-FR";
        default:
            return "ar-EG";
    }
}



function t(key, fallback = '') {
    const lang = getCurrentLanguage();
    if (typeof translations !== 'undefined' && translations[lang] && translations[lang][key]) {
        return translations[lang][key];
    }
    return fallback;
}

function getLastSixMonthsLabels() {
    const locale = getLocaleForCurrentLanguage();
    const formatter = new Intl.DateTimeFormat(locale, { month: 'short' });
    const labels = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        labels.push(formatter.format(d));
    }

    return labels;
}

// تهيئة لوحة التحكم
function initializeDashboard() {
    loadDashboardData();
    setupDashboardEvents();
    initializeCharts();
}

// تحميل بيانات لوحة التحكم
function loadDashboardData() {
    updateStats();
    loadUpcomingAppointments();
    loadQuickStats();
}

// إعداد أحداث لوحة التحكم
function setupDashboardEvents() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');

    if (sidebarToggle && sidebar && mainContent) {
        sidebarToggle.addEventListener('click', function () {
            sidebar.classList.toggle('active');
            mainContent.classList.toggle('sidebar-active');
        });
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function (e) {
            e.preventDefault();
            handleLogout();
        });
    }

    const chartPeriod = document.getElementById('chartPeriod');
    if (chartPeriod) {
        chartPeriod.addEventListener('change', function () {
            updateChartData(this.value);
        });
    }

    document.addEventListener('languageChanged', () => {
        loadUpcomingAppointments();
        loadQuickStats();
        initializeCharts();
        updateStats();
    });
}

// تحديث الإحصائيات
function updateStats() {
    const stats = {
        totalAppointments: 1245,
        totalPatients: 843,
        totalDoctors: 156,
        totalRevenue: 285400
    };

    animateCounter('totalAppointments', stats.totalAppointments);
    animateCounter('totalPatients', stats.totalPatients);
    animateCounter('totalDoctors', stats.totalDoctors);
    animateCounter('totalRevenue', stats.totalRevenue, true);
}

// تأثير عد الأرقام
function animateCounter(elementId, targetValue, isCurrency = false) {
    const element = document.getElementById(elementId);
    if (!element) return;

    let currentValue = parseInt(element.textContent.replace(/[^0-9]/g, ''), 10) || 0;
    const increment = Math.ceil(targetValue / 100);
    const duration = 1500;
    const interval = duration / (targetValue / increment);

    const timer = setInterval(() => {
        currentValue += increment;
        if (currentValue >= targetValue) {
            currentValue = targetValue;
            clearInterval(timer);
        }

        element.textContent = isCurrency
            ? formatCurrency(currentValue)
            : currentValue.toLocaleString(getLocaleForCurrentLanguage());
    }, interval);
}

// تنسيق العملة
function formatCurrency(amount) {
    return new Intl.NumberFormat(getLocaleForCurrentLanguage(), {
        style: 'currency',
        currency: 'SAR',
        minimumFractionDigits: 0
    }).format(amount);
}

// تحميل الحجوزات القريبة
function loadUpcomingAppointments() {
    const appointmentsTable = document.getElementById('upcomingAppointments');
    if (!appointmentsTable) return;

    const appointments = [
        { id: 1, patientNameKey: 'patient_1', doctorName: 'Dr. Ali Hasan', departmentKey: 'dept_heart', date: '2026-02-15', time: '10:00', status: 'statusConfirmed' },
        { id: 2, patientNameKey: 'patient_2', doctorName: 'Dr. Nadia Mohamed', departmentKey: 'dept_pediatrics', date: '2026-01-16', time: '14:00', status: 'statusConfirmed' },
        { id: 3, patientNameKey: 'patient_3', doctorName: 'Dr. Khaled Mahmoud', departmentKey: 'neurology', date: '2026-02-17', time: '11:30', status: 'statusConfirmed' },
        { id: 4, patientNameKey: 'patient_4', doctorName: 'Dr. Ahmed Ali', departmentKey: 'dept_eyes', date: '2026-03-18', time: '09:00', status: 'statusPending' },
        { id: 5, patientNameKey: 'patient_5', doctorName: 'Dr. Emad Hassan', departmentKey: 'dept_eyes', date: '2026-02-18', time: '09:00', status: 'statusConfirmed' }
    ];

    appointmentsTable.innerHTML = '';
    appointments.forEach(appointment => {
        const row = createAppointmentRow(appointment);
        appointmentsTable.appendChild(row);
    });
}

function createAppointmentRow(appointment) {
    const row = document.createElement('tr');
    const locale = getLocaleForCurrentLanguage();

    const date = new Date(appointment.date);
    const formattedDate = date.toLocaleDateString(locale, {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    const patientName = t(appointment.patientNameKey, appointment.patientNameKey);
    const departmentName = t(appointment.departmentKey, appointment.departmentKey);
    const statusText = t(appointment.status, appointment.status);

    row.innerHTML = `
        <td>${patientName}</td>
        <td>${appointment.doctorName}</td>
        <td>${departmentName}</td>
        <td>${formattedDate}</td>
        <td>${appointment.time}</td>
        <td>
            <span class="status-badge ${appointment.status}">${statusText}</span>
        </td>
        <td>
            <div class="action-buttons">
                <button class="action-btn" title="${t('actionConfirm', 'Confirm')}" onclick="confirmAppointment(${appointment.id})">
                    <i class="fas fa-check"></i>
                </button>
                <button class="action-btn" title="${t('actionEdit', 'Edit')}" onclick="editAppointment(${appointment.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn" title="${t('actionDelete', 'Delete')}" onclick="deleteAppointment(${appointment.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </td>
    `;

    return row;
}

function getLocaleForCurrentLanguage() {
    switch (currentLang) {
        case "en": return "en-US";
        case "fr": return "fr-FR";
        default: return "ar-EG";
    }
}

appointmentsTable.innerHTML = '';
appointments.forEach(appointment => {
    const row = createAppointmentRow(appointment);
    appointmentsTable.appendChild(row);
});

if (typeof translatePage === "function") {
    translatePage();
}





// إنشاء صف لحجز
function createAppointmentRow(appointment) {
    const row = document.createElement('tr');
    const locale = getLocaleForCurrentLanguage();

    const date = new Date(appointment.date);
    const formattedDate = date.toLocaleDateString(locale, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const patientName = t(appointment.patientNameKey, appointment.patientNameKey);
    const departmentName = t(appointment.departmentKey, appointment.departmentKey);
    const statusText = t(appointment.status, appointment.status);

    row.innerHTML = `
        <td>${patientName}</td>
        <td>${appointment.doctorName}</td>
        <td>${departmentName}</td>
        <td>${formattedDate}</td>
        <td>${appointment.time}</td>
        <td>
            <span class="status-badge ${appointment.status}">
                ${statusText}
            </span>
        </td>
        <td>
            <div class="action-buttons">
                <button class="action-btn"
                        title="${t('actionConfirm', 'Confirm')}"
                        onclick="confirmAppointment(${appointment.id})">
                    <i class="fas fa-check"></i>
                </button>

                <button class="action-btn"
                        title="${t('actionEdit', 'Edit')}"
                        onclick="editAppointment(${appointment.id})">
                    <i class="fas fa-edit"></i>
                </button>

                <button class="action-btn"
                        title="${t('actionDelete', 'Delete')}"
                        onclick="deleteAppointment(${appointment.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </td>
    `;

    return row;
}



// الحصول على نص حالة الحجز


function getStatusText(status) {
    return t(status, status);
}


// تحميل الإحصائيات السريعة
function loadQuickStats() {
    const stats = {
        todayAppointments: 42,
        weekAppointments: 156,
        clinicOccupancy: 78,
        patientSatisfaction: 92
    };

    document.getElementById('todayAppointments').textContent = stats.todayAppointments;
    document.getElementById('weekAppointments').textContent = stats.weekAppointments;
    document.getElementById('clinicOccupancy').textContent = `${stats.clinicOccupancy}%`;
    document.getElementById('patientSatisfaction').textContent = `${stats.patientSatisfaction}%`;
}

// تهيئة المخططات
function initializeCharts() {
    if (typeof Chart === 'undefined') {
        console.error('Chart.js library is not loaded');
        return;
    }

    if (appointmentsChartInstance) {
        appointmentsChartInstance.destroy();
        appointmentsChartInstance = null;
    }

    if (departmentsChartInstance) {
        departmentsChartInstance.destroy();
        departmentsChartInstance = null;
    }

    const appointmentsCtx = document.getElementById('appointmentsChart');
    if (appointmentsCtx) {
        appointmentsChartInstance = createAppointmentsChart(appointmentsCtx);
    }

    const departmentsCtx = document.getElementById('departmentsChart');
    if (departmentsCtx) {
        departmentsChartInstance = createDepartmentsChart(departmentsCtx);
    }
}

// إنشاء مخطط الحجوزات
function createAppointmentsChart(ctx) {
    const months = getLastSixMonthsLabels();
    const appointmentsData = [120, 190, 150, 210, 180, 250];

    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [{
                label: t('chartAppointmentsDatasetLabel', 'Appointments'),
                data: appointmentsData,
                borderColor: '#3498db',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        font: {
                            family: 'Cairo',
                            size: 14
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        font: {
                            family: 'Cairo',
                            size: 12
                        }
                    }
                },
                x: {
                    ticks: {
                        font: {
                            family: 'Cairo',
                            size: 12
                        }
                    }
                }
            }
        }
    });
}

// إنشاء مخطط الأقسام
function createDepartmentsChart(ctx) {
    const departments = [
        t('dept_heart', 'Cardiology'),
        t('neurology', 'Neurology'),
        t('dept_pediatrics', 'Pediatrics'),
        t('dept_eyes', 'Ophthalmology'),
        t('dentistry', 'Dentistry'),
        t('physiotherapy', 'Physiotherapy')
    ];
    const appointmentsData = [320, 180, 250, 150, 220, 120];

    return new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: departments,
            datasets: [{
                label: t('chartDepartmentsDatasetLabel', 'Appointments'),
                data: appointmentsData,
                backgroundColor: [
                    '#3498db',
                    '#2ecc71',
                    '#e74c3c',
                    '#f39c12',
                    '#9b59b6',
                    '#1abc9c'
                ],
                borderWidth: 2,
                borderColor: 'white'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        font: {
                            family: 'Cairo',
                            size: 12
                        },
                        padding: 20
                    }
                }
            }
        }
    });
}

// تحديث بيانات المخطط
function updateChartData(period) {
    console.log('Updating chart data for period:', period);
}

// دوال إدارة الحجوزات
function confirmAppointment(appointmentId) {
    if (confirm(t('confirmAppointmentPrompt', 'Do you want to confirm this appointment?'))) {
        showNotification(t('confirmAppointmentSuccess', 'Appointment confirmed successfully'), 'success');
    }
}

function editAppointment(appointmentId) {
    showNotification(t('editAppointmentNotice', 'Opening appointment edit form'), 'info');
}

function deleteAppointment(appointmentId) {
    if (confirm(t('deleteAppointmentPrompt', 'Are you sure you want to delete this appointment?'))) {
        showNotification(t('deleteAppointmentSuccess', 'Appointment deleted successfully'), 'success');
    }
}

// إظهار إشعار
function showNotification(message, type = 'info') {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="close-notification">&times;</button>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    const closeBtn = notification.querySelector('.close-notification');
    closeBtn.addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });

    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 5000);
}
