// تهيئة صفحة تسجيل الدخول
document.addEventListener('DOMContentLoaded', function () {
    initializeAuthPage();
});

// تهيئة صفحة المصادقة
function initializeAuthPage() {
    // عناصر DOM
    const authForm = document.getElementById('authForm');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const loginBtn = document.getElementById('loginBtn');
    const loginText = document.getElementById('loginText');
    const loginSpinner = document.getElementById('loginSpinner');

    // تبديل عرض كلمة المرور
    if (togglePasswordBtn) {
        togglePasswordBtn.addEventListener('click', function () {
            const passwordInput = document.getElementById('loginPassword');
            const icon = this.querySelector('i');

            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    }

    // معالجة تسجيل الدخول
    if (authForm) {
        authForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            // الحصول على بيانات النموذج
            const username = document.getElementById('loginUsername').value.trim();
            const password = document.getElementById('loginPassword').value.trim();
            const rememberMe = document.getElementById('rememberMe').checked;

            // التحقق من صحة البيانات
            if (!username || !password) {
                showNotification('الرجاء ملء جميع الحقول المطلوبة', 'error');
                return;
            }

            // عرض حالة التحميل
            loginBtn.disabled = true;
            loginText.style.display = 'none';
            loginSpinner.classList.remove('hidden');

            try {
                // محاكاة اتصال بالخادم
                await handleLogin(username, password, rememberMe);
            } catch (error) {
                showNotification('حدث خطأ أثناء تسجيل الدخول', 'error');
            } finally {
                // إخفاء حالة التحميل
                loginBtn.disabled = false;
                loginText.style.display = 'block';
                loginSpinner.classList.add('hidden');
            }
        });
    }

    // زر الدخول بحساب Google
    const googleBtn = document.querySelector('.btn-social.google');
    if (googleBtn) {
        googleBtn.addEventListener('click', function () {
            showNotification('هذه الميزة قيد التطوير حالياً', 'info');
        });
    }

    // زر الدخول بحساب Twitter
    const twitterBtn = document.querySelector('.btn-social.twitter');
    if (twitterBtn) {
        twitterBtn.addEventListener('click', function () {
            showNotification('هذه الميزة قيد التطوير حالياً', 'info');
        });
    }
}

// معالجة تسجيل الدخول
async function handleLogin(username, password, rememberMe) {
    // محاكاة تأخير الشبكة
    await new Promise(resolve => setTimeout(resolve, 1500));

    // محاكاة بيانات المستخدمين
    const users = [
        {
            id: 1,
            username: 'admin',
            email: 'admin@medical.com',
            password: 'admin123',
            fullName: 'مدير النظام',
            role: 'admin'
        },
        {
            id: 2,
            username: 'doctor',
            email: 'doctor@medical.com',
            password: 'doctor123',
            fullName: 'د. أحمد محمد',
            role: 'doctor'
        },
        {
            id: 3,
            username: 'patient',
            email: 'patient@medical.com',
            password: 'patient123',
            fullName: 'محمد أحمد',
            role: 'patient'
        }
    ];

    // البحث عن المستخدم
    const user = users.find(u =>
        (u.username === username || u.email === username) &&
        u.password === password
    );

    if (user) {
        // إزالة كلمة المرور قبل التخزين
        const userData = { ...user };
        delete userData.password;

        // تخزين بيانات المستخدم
        if (rememberMe) {
            localStorage.setItem('medicalPlatformUser', JSON.stringify(userData));
        } else {
            sessionStorage.setItem('medicalPlatformUser', JSON.stringify(userData));
        }

        // إظهار رسالة النجاح
        showNotification(`مرحباً ${user.fullName}! تم تسجيل الدخول بنجاح`, 'success');

        // توجيه المستخدم إلى لوحة التحكم
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);

        return true;
    } else {
        showNotification('اسم المستخدم أو كلمة المرور غير صحيحة', 'error');
        return false;
    }
}

// دالة تسجيل الخروج
function handleLogout() {
    // حذف بيانات المستخدم من التخزين المحلي
    localStorage.removeItem('medicalPlatformUser');
    sessionStorage.removeItem('medicalPlatformUser');

    // إظهار رسالة التأكيد
    showNotification('تم تسجيل الخروج بنجاح', 'success');

    // توجيه المستخدم إلى الصفحة الرئيسية
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

// التحقق من حالة تسجيل الدخول
function checkAuth() {
    const userData = localStorage.getItem('medicalPlatformUser') ||
        sessionStorage.getItem('medicalPlatformUser');

    if (!userData) {
        // توجيه المستخدم غير المسجل إلى صفحة تسجيل الدخول
        if (!window.location.href.includes('login.html') &&
            !window.location.href.includes('index.html')) {
            window.location.href = 'login.html';
        }
        return null;
    }

    return JSON.parse(userData);
}

// تحديث واجهة المستخدم بناءً على الدور
function updateUIByRole(user) {
    const navLinks = document.getElementById('navLinks');

    if (navLinks && user) {
        // إضافة رابط لوحة التحكم للمستخدمين المسجلين
        let dashboardLink = navLinks.querySelector('a[href="dashboard.html"]');

        if (!dashboardLink) {
            dashboardLink = document.createElement('a');
            dashboardLink.href = 'dashboard.html';
            dashboardLink.innerHTML = '<i class="fas fa-tachometer-alt"></i> لوحة التحكم';

            const li = document.createElement('li');
            li.appendChild(dashboardLink);

            // إضافة قبل رابط تسجيل الدخول أو في النهاية
            const loginLink = navLinks.querySelector('a[href="login.html"]');
            if (loginLink) {
                loginLink.parentNode.insertBefore(li, loginLink.parentNode.firstChild);
            } else {
                navLinks.appendChild(li);
            }
        }

        // إضافة زر تسجيل الخروج
        let logoutLink = navLinks.querySelector('.logout-btn');
        if (!logoutLink) {
            logoutLink = document.createElement('a');
            logoutLink.className = 'logout-btn';
            logoutLink.href = '#';
            logoutLink.innerHTML = '<i class="fas fa-sign-out-alt"></i> تسجيل الخروج';
            logoutLink.addEventListener('click', function (e) {
                e.preventDefault();
                handleLogout();
            });

            const li = document.createElement('li');
            li.appendChild(logoutLink);
            navLinks.appendChild(li);
        }
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

// تصدير الدوال للاستخدام في ملفات أخرى
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        handleLogin,
        handleLogout,
        checkAuth,
        updateUIByRole,
        showNotification
    };
}

// التحقق من صحة التسجيل (يمكن استخدامها في صفحة التسجيل)
function validateRegistrationForm(formData) {
    const errors = {};

    // التحقق من الاسم الأول
    if (!formData.firstName || formData.firstName.length < 2) {
        errors.firstName = 'الاسم الأول يجب أن يكون على الأقل حرفين';
    }

    // التحقق من اسم العائلة
    if (!formData.lastName || formData.lastName.length < 2) {
        errors.lastName = 'اسم العائلة يجب أن يكون على الأقل حرفين';
    }

    // التحقق من البريد الإلكتروني
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = 'البريد الإلكتروني غير صالح';
    }

    // التحقق من رقم الهاتف
    if (!formData.phone || !/^(05)[0-9]{8}$/.test(formData.phone)) {
        errors.phone = 'رقم الهاتف يجب أن يبدأ بـ 05 ويتكون من 10 أرقام';
    }

    // التحقق من كلمة المرور
    if (!formData.password || formData.password.length < 8) {
        errors.password = 'كلمة المرور يجب أن تكون على الأقل 8 أحرف';
    }

    // التحقق من تأكيد كلمة المرور
    if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'كلمة المرور غير متطابقة';
    }

    // التحقق من تاريخ الميلاد
    if (!formData.dateOfBirth) {
        errors.dateOfBirth = 'تاريخ الميلاد مطلوب';
    } else {
        const birthDate = new Date(formData.dateOfBirth);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();

        if (age < 18) {
            errors.dateOfBirth = 'يجب أن يكون عمرك 18 سنة على الأقل';
        }
    }

    // التحقق من الجنس
    if (!formData.gender) {
        errors.gender = 'الرجاء اختيار الجنس';
    }

    // التحقق من الموافقة على الشروط
    if (!formData.agreeTerms) {
        errors.terms = 'يجب الموافقة على الشروط والأحكام';
    }

    return errors;
}

// تسجيل مستخدم جديد
async function registerNewUser(userData) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // محاكاة التحقق من وجود المستخدم
            const existingUsers = JSON.parse(localStorage.getItem('medicalPlatformUsers') || '[]');
            const existingUser = existingUsers.find(u => u.email === userData.email);

            if (existingUser) {
                reject('هذا البريد الإلكتروني مسجل بالفعل');
                return;
            }

            // إنشاء معرف فريد
            const userId = existingUsers.length > 0 ? Math.max(...existingUsers.map(u => u.id)) + 1 : 1;

            // إضافة المستخدم الجديد
            const newUser = {
                id: userId,
                username: userData.email.split('@')[0],
                email: userData.email,
                fullName: userData.fullName,
                phone: userData.phone,
                role: 'patient',
                isActive: true,
                createdAt: new Date().toISOString(),
                medicalInfo: {
                    bloodType: userData.bloodType,
                    height: userData.height,
                    weight: userData.weight,
                    chronicDiseases: userData.chronicDiseases,
                    allergies: userData.allergies,
                    insuranceCompany: userData.insuranceCompany,
                    insuranceNumber: userData.insuranceNumber
                }
            };

            existingUsers.push(newUser);
            localStorage.setItem('medicalPlatformUsers', JSON.stringify(existingUsers));

            resolve(newUser);
        }, 1500);
    });
}

// تسجيل الدخول تلقائياً بعد التسجيل (اختياري)
function autoLoginAfterRegistration(userData) {
    const user = {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        fullName: userData.fullName,
        role: userData.role || 'patient'
    };

    // حفظ بيانات المستخدم
    localStorage.setItem('medicalPlatformUser', JSON.stringify(user));

    // إظهار رسالة الترحيب
    showNotification(`مرحباً ${user.fullName}! تم إنشاء حسابك بنجاح`, 'success');

    // توجيه المستخدم إلى لوحة التحكم
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 2000);
}

// التحقق مما إذا كان المستخدم مسجلاً (يمكن استخدامه في جميع الصفحات)
function isUserRegistered(email) {
    const users = JSON.parse(localStorage.getItem('medicalPlatformUsers') || '[]');
    return users.some(user => user.email === email);
}