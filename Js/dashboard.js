// تهيئة لوحة التحكم
function initializeDashboard() {
    loadDashboardData();
    setupDashboardEvents();
    initializeCharts();
}

// تحميل بيانات لوحة التحكم
function loadDashboardData() {
    // تحديث الإحصائيات
    updateStats();

    // تحميل الحجوزات القريبة
    loadUpcomingAppointments();

    // تحميل الإحصائيات السريعة
    loadQuickStats();
}

// إعداد أحداث لوحة التحكم
function setupDashboardEvents() {
    // تبديل القائمة الجانبية
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');

    if (sidebarToggle && sidebar && mainContent) {
        sidebarToggle.addEventListener('click', function () {
            sidebar.classList.toggle('active');
            mainContent.classList.toggle('sidebar-active');
        });
    }

    // زر تسجيل الخروج
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function (e) {
            e.preventDefault();
            handleLogout();
        });
    }

    // تغيير فترة المخطط
    const chartPeriod = document.getElementById('chartPeriod');
    if (chartPeriod) {
        chartPeriod.addEventListener('change', function () {
            updateChartData(this.value);
        });
    }
}

// تحديث الإحصائيات
function updateStats() {
    // بيانات إحصائية تجريبية
    const stats = {
        totalAppointments: 1245,
        totalPatients: 843,
        totalDoctors: 156,
        totalRevenue: 285400
    };

    // تحديث قيم الإحصائيات مع تأثير العد
    animateCounter('totalAppointments', stats.totalAppointments);
    animateCounter('totalPatients', stats.totalPatients);
    animateCounter('totalDoctors', stats.totalDoctors);
    animateCounter('totalRevenue', stats.totalRevenue, true);
}

// تأثير عد الأرقام
function animateCounter(elementId, targetValue, isCurrency = false) {
    const element = document.getElementById(elementId);
    if (!element) return;

    let currentValue = parseInt(element.textContent.replace(/[^0-9]/g, '')) || 0;
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
            : currentValue.toLocaleString();
    }, interval);
}

// تنسيق العملة
function formatCurrency(amount) {
    return new Intl.NumberFormat('ar-SA', {
        style: 'currency',
        currency: 'SAR',
        minimumFractionDigits: 0
    }).format(amount);
}

// تحميل الحجوزات القريبة
function loadUpcomingAppointments() {
    const appointmentsTable = document.getElementById('upcomingAppointments');
    if (!appointmentsTable) return;

    // بيانات حجوزات تجريبية
    const appointments = [
        {
            id: 1,
            patientName: 'محمد أحمد',
            doctorName: 'د. علي حسن',
            department: 'طب القلب',
            date: '2024-01-15',
            time: '10:00 ص',
            status: 'confirmed'
        },
        {
            id: 2,
            patientName: 'سارة خالد',
            doctorName: 'د. نادية محمد',
            department: 'طب الأطفال',
            date: '2024-01-16',
            time: '02:00 م',
            status: 'pending'
        },
        {
            id: 3,
            patientName: 'عمر سليم',
            doctorName: 'د. خالد محمود',
            department: 'طب الأعصاب',
            date: '2024-01-17',
            time: '11:30 ص',
            status: 'confirmed'
        },
        {
            id: 4,
            patientName: 'فاطمة عمر',
            doctorName: 'د. أحمد علي',
            department: 'طب العيون',
            date: '2024-01-18',
            time: '09:00 ص',
            status: 'pending'
        }
    ];

    // إضافة الحجوزات للجدول
    appointmentsTable.innerHTML = '';
    appointments.forEach(appointment => {
        const row = createAppointmentRow(appointment);
        appointmentsTable.appendChild(row);
    });
}

// إنشاء صف لحجز
function createAppointmentRow(appointment) {
    const row = document.createElement('tr');

    // تنسيق التاريخ
    const date = new Date(appointment.date);
    const formattedDate = date.toLocaleDateString('ar-SA', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    row.innerHTML = `
        <td>${appointment.patientName}</td>
        <td>${appointment.doctorName}</td>
        <td>${appointment.department}</td>
        <td>${formattedDate}</td>
        <td>${appointment.time}</td>
        <td>
            <span class="status-badge ${appointment.status}">
                ${getStatusText(appointment.status)}
            </span>
        </td>
        <td>
            <div class="action-buttons">
                <button class="action-btn" title="تأكيد" onclick="confirmAppointment(${appointment.id})">
                    <i class="fas fa-check"></i>
                </button>
                <button class="action-btn" title="تعديل" onclick="editAppointment(${appointment.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn" title="حذف" onclick="deleteAppointment(${appointment.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </td>
    `;

    return row;
}

// الحصول على نص حالة الحجز
function getStatusText(status) {
    const statusMap = {
        'pending': 'قيد الانتظار',
        'confirmed': 'مؤكد',
        'completed': 'مكتمل',
        'cancelled': 'ملغي'
    };

    return statusMap[status] || status;
}

// تحميل الإحصائيات السريعة
function loadQuickStats() {
    // بيانات تجريبية
    const stats = {
        todayAppointments: 42,
        weekAppointments: 156,
        clinicOccupancy: 78,
        patientSatisfaction: 92
    };

    // تحديث القيم
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

    // مخطط الحجوزات
    const appointmentsCtx = document.getElementById('appointmentsChart');
    if (appointmentsCtx) {
        createAppointmentsChart(appointmentsCtx);
    }

    // مخطط الأقسام
    const departmentsCtx = document.getElementById('departmentsChart');
    if (departmentsCtx) {
        createDepartmentsChart(departmentsCtx);
    }
}

// إنشاء مخطط الحجوزات
function createAppointmentsChart(ctx) {
    // بيانات تجريبية للحجوزات
    const months = ['يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    const appointmentsData = [120, 190, 150, 210, 180, 250];

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [{
                label: 'عدد الحجوزات',
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
    // بيانات تجريبية للأقسام
    const departments = ['القلب', 'الأعصاب', 'الأطفال', 'العيون', 'الأسنان', 'الطبيعي'];
    const appointmentsData = [320, 180, 250, 150, 220, 120];

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: departments,
            datasets: [{
                label: 'عدد الحجوزات',
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
    console.log('تحديث بيانات المخطط للفترة:', period);
    // هنا يمكنك إضافة منطق تحديث بيانات المخطط بناءً على الفترة المحددة
}

// دوال إدارة الحجوزات
function confirmAppointment(appointmentId) {
    if (confirm('هل تريد تأكيد هذا الحجز؟')) {
        showNotification('تم تأكيد الحجز بنجاح', 'success');
        // هنا يمكنك إضافة منطق تأكيد الحجز
    }
}

function editAppointment(appointmentId) {
    showNotification('فتح نموذج تعديل الحجز', 'info');
    // هنا يمكنك إضافة منطق فتح نموذج التعديل
}

function deleteAppointment(appointmentId) {
    if (confirm('هل أنت متأكد من حذف هذا الحجز؟')) {
        showNotification('تم حذف الحجز بنجاح', 'success');
        // هنا يمكنك إضافة منطق حذف الحجز
    }
}

// إظهار إشعار
function showNotification(message, type = 'info') {
    // إزالة أي إشعارات سابقة
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // إنشاء عنصر الإشعار
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="close-notification">&times;</button>
    `;

    // إضافة الإشعار إلى body
    document.body.appendChild(notification);

    // إضافة أنيميشن
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    // إعداد إغلاق الإشعار
    const closeBtn = notification.querySelector('.close-notification');
    closeBtn.addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });

    // إزالة الإشعار تلقائياً بعد 5 ثوانٍ
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 5000);
}