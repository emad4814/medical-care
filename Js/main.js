
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


/* =========================
   App Initialization
========================= */
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    setupEventListeners();
    updateUserUI();
    updateLoginLink();

    if (document.querySelector('.stat-item')) {
        initializeStatsCounter();
    }

    if (document.getElementById('departmentsGrid')) {
        loadDepartments();
    }
});


/* =========================
   Load Static Data
========================= */
function loadData() {

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
        clinicsCount: 84,
        doctorsCount: 365,
        patientsCount: 7347,
        appointmentsCount: 1245
    };

    const storedUser = localStorage.getItem('medicalPlatformUser');
    if (storedUser) {
        appData.user = JSON.parse(storedUser);
    }
}


/* =========================
   Event Listeners
========================= */
function setupEventListeners() {

    /* Mobile Menu */
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.innerHTML = navLinks.classList.contains('active')
                ? '<i class="fas fa-times"></i>'
                : '<i class="fas fa-bars"></i>';
        });

        document.addEventListener('click', e => {
            if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    }

    /* Login Modal */
    const loginModal = document.getElementById('loginModal');
    const closeModal = document.getElementById('closeModal');
    const loginForm = document.getElementById('loginForm');

    if (loginModal && closeModal) {

        document.querySelectorAll('.btn-login').forEach(btn => {
            btn.addEventListener('click', e => {
                e.preventDefault();
                loginModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        closeModal.addEventListener('click', closeLoginModal);
        loginModal.addEventListener('click', e => {
            if (e.target === loginModal) closeLoginModal();
        });

        if (loginForm) {
            loginForm.addEventListener('submit', e => {
                e.preventDefault();
                handleLogin();
            });
        }
    }
}


/* =========================
   Departments Section
========================= */
function loadDepartments() {
    const grid = document.getElementById('departmentsGrid');
    if (!grid) return;

    grid.innerHTML = '';

    appData.departments.forEach(dept => {
        grid.appendChild(createDepartmentCard(dept));
    });
}

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

            <a href="services.html?department=${department.id}" class="btn btn-primary">
                <i class="fas fa-calendar-alt"></i> احجز موعد
            </a>
        </div>
    `;

    return card;
}


/* =========================
   Stats Counter
========================= */
function initializeStatsCounter() {
    document.querySelectorAll('.stat-item h3').forEach(counter => {

        const label = counter.parentElement.querySelector('p').textContent;
        let target = 0;

        if (label.includes('عيادة')) target = appData.stats.clinicsCount;
        else if (label.includes('طبيب')) target = appData.stats.doctorsCount;
        else if (label.includes('مريض')) target = appData.stats.patientsCount;
        else if (label.includes('حجز')) target = appData.stats.appointmentsCount;

        counter.innerText = '0';
        counter.dataset.target = target;

        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                animateCounter(counter);
                observer.disconnect();
            }
        });

        observer.observe(counter);
    });
}

function animateCounter(counter) {
    const target = +counter.dataset.target;
    let current = 0;
    const increment = Math.ceil(target / 200);

    const update = () => {
        current += increment;
        if (current >= target) {
            counter.innerText = target.toLocaleString();
            return;
        }
        counter.innerText = current.toLocaleString();
        requestAnimationFrame(update);
    };

    update();
}


/* =========================
   Authentication
========================= */
function handleLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === 'admin' && password === 'admin123') {
        appData.user = {
            username,
            fullName: 'مدير النظام',
            role: 'admin'
        };

        localStorage.setItem('medicalPlatformUser', JSON.stringify(appData.user));
        closeLoginModal();
        updateUserUI();
        showNotification('تم تسجيل الدخول بنجاح', 'success');
    } else {
        showNotification('بيانات الدخول غير صحيحة', 'error');
    }
}

function logout() {
    localStorage.removeItem('medicalPlatformUser');
    appData.user = null;
    updateUserUI();
    showNotification('تم تسجيل الخروج', 'info');
}


/* =========================
   UI Helpers
========================= */
function updateUserUI() {
    const greeting = document.getElementById('userGreeting');
    if (greeting && appData.user) {
        greeting.textContent = `مرحباً، ${appData.user.fullName}`;
        greeting.style.display = 'inline-block';
    }
}

function updateLoginLink() {
    document.querySelectorAll('.btn-login').forEach(link => {
        if (appData.user) {
            link.innerHTML = '<i class="fas fa-user"></i> حسابي';
            link.href = 'dashboard.html';
        }
    });
}

function closeLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}


/* =========================
   Notifications
========================= */
function showNotification(message, type = 'info') {
    const note = document.createElement('div');
    note.className = `notification ${type}`;
    note.textContent = message;
    document.body.appendChild(note);

    setTimeout(() => note.classList.add('show'), 50);
    setTimeout(() => note.remove(), 4000);
}
