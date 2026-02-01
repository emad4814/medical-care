// بيانات التطبيق
const appData = {
    departments: [],
    clinics: [],
    appointments: [],
    user: null,
    stats: {
        clinicsCount: 0,
        doctorsCount: 0,
        patientsCount: 0,
        appointmentsCount: 0
    }
};

// تهيئة التطبيق
document.addEventListener('DOMContentLoaded', function () {
    loadData();
    setupEventListeners();
    initializeStatsCounter();
    loadDepartments();
});

// تحميل البيانات
function loadData() {
    // محاكاة تحميل البيانات من ملف خارجي
    appData.departments = [
        {
            id: 1,
            name: 'طب القلب',
            description: 'رعاية أمراض القلب والشرايين',
            icon: 'heartbeat',
            numberOfDoctors: 15,
            isActive: true
        },
        {
            id: 2,
            name: 'طب الأعصاب',
            description: 'تشخيص وعلاج اضطرابات الجهاز العصبي',
            icon: 'brain',
            numberOfDoctors: 12,
            isActive: true
        },
        {
            id: 3,
            name: 'طب الأطفال',
            description: 'رعاية صحية شاملة للأطفال',
            icon: 'baby',
            numberOfDoctors: 20,
            isActive: true
        },
        {
            id: 4,
            name: 'طب العيون',
            description: 'تشخيص وعلاج أمراض العيون',
            icon: 'eye',
            numberOfDoctors: 8,
            isActive: true
        },
        {
            id: 5,
            name: 'طب الأسنان',
            description: 'رعاية وتجميل الأسنان',
            icon: 'tooth',
            numberOfDoctors: 18,
            isActive: true
        },
        {
            id: 6,
            name: 'الطب الطبيعي',
            description: 'إعادة التأهيل والعلاج الطبيعي',
            icon: 'wheelchair',
            numberOfDoctors: 10,
            isActive: true
        }
    ];

    appData.stats = {
        clinicsCount: 50,
        doctorsCount: 200,
        patientsCount: 10000,
        appointmentsCount: 1245
    };

    // التحقق من وجود مستخدم مسجل
    const storedUser = localStorage.getItem('medicalPlatformUser');
    if (storedUser) {
        appData.user = JSON.parse(storedUser);
        updateUserUI();
    }
}

// إعداد مستمعي الأحداث
function setupEventListeners() {
    // القائمة المتحركة
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function () {
            navLinks.classList.toggle('active');
            menuToggle.innerHTML = navLinks.classList.contains('active')
                ? '<i class="fas fa-times"></i>'
                : '<i class="fas fa-bars"></i>';
        });
    }

    // إغلاق القائمة عند النقر خارجها
    document.addEventListener('click', function (event) {
        if (navLinks && menuToggle &&
            !navLinks.contains(event.target) &&
            !menuToggle.contains(event.target)) {
            navLinks.classList.remove('active');
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });

    // مودال تسجيل الدخول
    const loginModal = document.getElementById('loginModal');
    const closeModal = document.getElementById('closeModal');
    const loginForm = document.getElementById('loginForm');

    if (loginModal && closeModal) {
        // فتح المودال عند النقر على زر تسجيل الدخول
        const loginButtons = document.querySelectorAll('.btn-login, .btn-secondary[href*="login"]');
        loginButtons.forEach(button => {
            button.addEventListener('click', function (e) {
                if (this.getAttribute('href') === 'login.html') return;
                e.preventDefault();
                loginModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        // إغلاق المودال
        closeModal.addEventListener('click', function () {
            loginModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });

        // إغلاق المودال عند النقر خارج المحتوى
        loginModal.addEventListener('click', function (e) {
            if (e.target === loginModal) {
                loginModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });

        // معالجة نموذج تسجيل الدخول
        if (loginForm) {
            loginForm.addEventListener('submit', function (e) {
                e.preventDefault();
                handleLogin();
            });
        }
    }

    // تحديث الرابط بناءً على حالة المستخدم
    updateLoginLink();
}

// تحديث رابط تسجيل الدخول
function updateLoginLink() {
    const loginLinks = document.querySelectorAll('.btn-login, a[href="login.html"]');
    loginLinks.forEach(link => {
        if (appData.user) {
            link.innerHTML = '<i class="fas fa-user"></i> حسابي';
            link.href = 'dashboard.html';
            link.classList.remove('btn-login');
            link.classList.add('btn-secondary');
        } else {
            link.innerHTML = '<i class="fas fa-sign-in-alt"></i> تسجيل الدخول';
            link.href = 'login.html';
            link.classList.add('btn-login');
            link.classList.remove('btn-secondary');
        }
    });
}

// تحديث واجهة المستخدم بناءً على حالة تسجيل الدخول
function updateUserUI() {
    const userGreeting = document.getElementById('userGreeting');
    if (userGreeting && appData.user) {
        userGreeting.textContent = `مرحباً، ${appData.user.fullName}`;
        userGreeting.style.display = 'inline-block';
    }

    updateLoginLink();
}

// معالجة تسجيل الدخول
function handleLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const loginModal = document.getElementById('loginModal');

    // محاكاة التحقق من بيانات تسجيل الدخول
    if (username === 'admin' && password === 'admin123') {
        const user = {
            id: 1,
            username: 'admin',
            email: 'admin@medical.com',
            fullName: 'مدير النظام',
            role: 'admin'
        };

        appData.user = user;
        localStorage.setItem('medicalPlatformUser', JSON.stringify(user));

        // إغلاق المودال
        loginModal.classList.remove('active');
        document.body.style.overflow = 'auto';

        // تحديث واجهة المستخدم
        updateUserUI();

        // إظهار رسالة نجاح
        showNotification('تم تسجيل الدخول بنجاح!', 'success');

        // توجيه المستخدم إلى لوحة التحكم بعد 1.5 ثانية
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);

    } else {
        showNotification('اسم المستخدم أو كلمة المرور غير صحيحة', 'error');
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

// تهيئة عداد الإحصائيات
function initializeStatsCounter() {
    const counters = document.querySelectorAll('.stat-item h3');
    const speed = 200; // السرعة بالمللي ثانية

    counters.forEach(counter => {
        const updateCount = () => {
            const target = parseInt(counter.getAttribute('data-target'));
            const count = parseInt(counter.innerText);
            const increment = target / speed;

            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(updateCount, 1);
            } else {
                counter.innerText = target.toLocaleString();
            }
        };

        // تعيين القيم المستهدفة
        const statId = counter.parentElement.querySelector('p').textContent;
        let targetValue = 0;

        if (statId.includes('عيادة')) targetValue = appData.stats.clinicsCount;
        else if (statId.includes('طبيب')) targetValue = appData.stats.doctorsCount;
        else if (statId.includes('مريض')) targetValue = appData.stats.patientsCount;
        else if (statId.includes('حجز')) targetValue = appData.stats.appointmentsCount;

        counter.setAttribute('data-target', targetValue);
        counter.innerText = '0';

        // بدء العد عند التمرير
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCount();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(counter);
    });
}

// تحميل الأقسام الطبية
function loadDepartments() {
    const departmentsGrid = document.getElementById('departmentsGrid');
    if (!departmentsGrid) return;

    departmentsGrid.innerHTML = '';

    appData.departments.forEach(dept => {
        const departmentCard = createDepartmentCard(dept);
        departmentsGrid.appendChild(departmentCard);
    });
}

// إنشاء بطاقة قسم طبي
function createDepartmentCard(department) {
    const card = document.createElement('div');
    card.className = 'department-card';
    card.innerHTML = `
        <div class="department-header">
            <div class="department-icon">
                <i class="fas fa-${department.icon}"></i>
            </div>
            <h3>${department.name}</h3>
            <p>${department.description}</p>
        </div>
        <div class="department-body">
            <div class="department-info">
                <span class="doctors-count">${department.numberOfDoctors} طبيب</span>
                <span class="status-badge ${department.isActive ? 'active' : 'inactive'}">
                    ${department.isActive ? 'نشط' : 'غير نشط'}
                </span>
            </div>
            <div class="department-action">
                <a href="services.html?department=${department.id}" class="btn btn-primary">
                    <i class="fas fa-calendar-alt"></i> احجز موعد
                </a>
            </div>
        </div>
    `;

    return card;
}

// إضافة أنماط الإشعارات
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        left: 20px;
        background: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 15px;
        z-index: 3000;
        transform: translateX(-100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification.success {
        border-right: 4px solid #2ecc71;
    }
    
    .notification.error {
        border-right: 4px solid #e74c3c;
    }
    
    .notification.info {
        border-right: 4px solid #3498db;
    }
    
    .close-notification {
        background: none;
        border: none;
        font-size: 1.2rem;
        cursor: pointer;
        color: #7f8c8d;
    }
`;

document.head.appendChild(notificationStyles);

// تسجيل الخروج
function logout() {
    localStorage.removeItem('medicalPlatformUser');
    appData.user = null;
    updateUserUI();
    showNotification('تم تسجيل الخروج بنجاح', 'info');

    // توجيه المستخدم للصفحة الرئيسية بعد 1.5 ثانية
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}