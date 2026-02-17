// تهيئة صفحة التسجيل
document.addEventListener('DOMContentLoaded', function () {
    initializeRegistrationPage();
});

// تهيئة صفحة التسجيل
function initializeRegistrationPage() {
    // تعيين الخطوة الحالية
    let currentStep = 1;

    // إعداد أحداث الأزرار
    setupRegistrationEvents(currentStep);

    // إعداد التحقق من صحة المدخلات
    setupValidation();

    // إعداد تغيير عرض كلمة المرور
    setupPasswordToggle();

    // إعداد إظهار/إخفاء رقم بطاقة التأمين
    setupInsuranceDisplay();

    // إعداد تحديث نموذج التأكيد
    setupConfirmationUpdate();
}

// إعداد أحداث التسجيل
function setupRegistrationEvents(currentStep) {
    // زر التالي للخطوة 1
    const nextToStep2Btn = document.getElementById('nextToStep2');
    if (nextToStep2Btn) {
        nextToStep2Btn.addEventListener('click', function () {
            if (validateStep1()) {
                goToStep(2);
            }
        });
    }

    // زر التالي للخطوة 2
    const nextToStep3Btn = document.getElementById('nextToStep3');
    if (nextToStep3Btn) {
        nextToStep3Btn.addEventListener('click', function () {
            if (validateStep2()) {
                updateConfirmationDetails();
                goToStep(3);
            }
        });
    }

    // زر الرجوع للخطوة 1
    const backToStep1Btn = document.getElementById('backToStep1');
    if (backToStep1Btn) {
        backToStep1Btn.addEventListener('click', function () {
            goToStep(1);
        });
    }

    // زر الرجوع للخطوة 2
    const backToStep2Btn = document.getElementById('backToStep2');
    if (backToStep2Btn) {
        backToStep2Btn.addEventListener('click', function () {
            goToStep(2);
        });
    }

    // زر إنشاء الحساب
    const createAccountBtn = document.getElementById('createAccountBtn');
    const registerForm = document.getElementById('registerForm');

    if (createAccountBtn && registerForm) {
        registerForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            if (validateStep3()) {
                await handleRegistration();
            }
        });
    }
}

// الانتقال بين الخطوات
function goToStep(stepNumber) {
    // إخفاء جميع الخطوات
    const steps = document.querySelectorAll('.step-content');
    steps.forEach(step => {
        step.classList.remove('active');
    });

    // إزالة النشاط من جميع خطوات التقدم
    const progressSteps = document.querySelectorAll('.step');
    progressSteps.forEach(step => {
        step.classList.remove('active');
    });

    // إظهار الخطوة المطلوبة
    const currentStep = document.getElementById(`step${stepNumber}Content`);
    if (currentStep) {
        currentStep.classList.add('active');
    }

    // تفعيل خطوة التقدم
    const currentProgressStep = document.getElementById(`step${stepNumber}`);
    if (currentProgressStep) {
        currentProgressStep.classList.add('active');
    }

    // التمرير لأعلى الصفحة
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// إعداد التحقق من صحة المدخلات
function setupValidation() {
    // تحقق من الاسم الأول أثناء الكتابة
    const firstNameInput = document.getElementById('firstName');
    if (firstNameInput) {
        firstNameInput.addEventListener('input', function () {
            validateName(this.value, 'firstNameError');
        });
    }

    // تحقق من اسم العائلة أثناء الكتابة
    const lastNameInput = document.getElementById('lastName');
    if (lastNameInput) {
        lastNameInput.addEventListener('input', function () {
            validateName(this.value, 'lastNameError');
        });
    }

    // تحقق من البريد الإلكتروني أثناء الكتابة
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('input', function () {
            validateEmail(this.value);
        });
    }

    // تحقق من رقم الهاتف أثناء الكتابة
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function () {
            validatePhone(this.value);
        });
    }

    // تحقق من كلمة المرور أثناء الكتابة
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        passwordInput.addEventListener('input', function () {
            validatePassword(this.value);
        });
    }

    // تحقق من تأكيد كلمة المرور أثناء الكتابة
    const confirmPasswordInput = document.getElementById('confirmPassword');
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', function () {
            validateConfirmPassword();
        });
    }

    // تحقق من تاريخ الميلاد
    const dateOfBirthInput = document.getElementById('dateOfBirth');
    if (dateOfBirthInput) {
        dateOfBirthInput.addEventListener('change', function () {
            validateDateOfBirth(this.value);
        });
    }
}

// إعداد تغيير عرض كلمة المرور
function setupPasswordToggle() {
    const toggleButtons = document.querySelectorAll('.toggle-password');
    toggleButtons.forEach(button => {
        button.addEventListener('click', function () {
            const targetId = this.getAttribute('data-target');
            const passwordInput = document.getElementById(targetId);
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
    });
}

// إعداد إظهار/إخفاء رقم بطاقة التأمين
function setupInsuranceDisplay() {
    const insuranceSelect = document.getElementById('insuranceCompany');
    const insuranceNumberGroup = document.getElementById('insuranceNumberGroup');

    if (insuranceSelect && insuranceNumberGroup) {
        insuranceSelect.addEventListener('change', function () {
            if (this.value && this.value !== 'none') {
                insuranceNumberGroup.style.display = 'block';
            } else {
                insuranceNumberGroup.style.display = 'none';
                document.getElementById('insuranceNumber').value = '';
            }
        });
    }
}

// إعداد تحديث نموذج التأكيد
function setupConfirmationUpdate() {
    // تحديث تفاصيل التأكيد عند أي تغيير
    const inputsToWatch = ['firstName', 'lastName', 'email', 'phone', 'dateOfBirth', 'bloodType'];

    inputsToWatch.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('change', updateConfirmationDetails);
        }
    });

    // تحديث الجنس
    const genderInputs = document.querySelectorAll('input[name="gender"]');
    genderInputs.forEach(input => {
        input.addEventListener('change', updateConfirmationDetails);
    });
}

// التحقق من صحة الخطوة 1
function validateStep1() {
    let isValid = true;

    // التحقق من الاسم الأول
    const firstName = document.getElementById('firstName').value.trim();
    if (!validateName(firstName, 'firstNameError')) {
        isValid = false;
    }

    // التحقق من اسم العائلة
    const lastName = document.getElementById('lastName').value.trim();
    if (!validateName(lastName, 'lastNameError')) {
        isValid = false;
    }

    // التحقق من البريد الإلكتروني
    const email = document.getElementById('email').value.trim();
    if (!validateEmail(email)) {
        isValid = false;
    }

    // التحقق من رقم الهاتف
    const phone = document.getElementById('phone').value.trim();
    if (!validatePhone(phone)) {
        isValid = false;
    }

    // التحقق من كلمة المرور
    const password = document.getElementById('password').value;
    if (!validatePassword(password)) {
        isValid = false;
    }

    // التحقق من تأكيد كلمة المرور
    if (!validateConfirmPassword()) {
        isValid = false;
    }

    // التحقق من تاريخ الميلاد
    const dateOfBirth = document.getElementById('dateOfBirth').value;
    if (!validateDateOfBirth(dateOfBirth)) {
        isValid = false;
    }

    // التحقق من الجنس
    const gender = document.querySelector('input[name="gender"]:checked');
    if (!gender) {
        document.getElementById('genderError').textContent = 'الرجاء اختيار الجنس';
        isValid = false;
    } else {
        document.getElementById('genderError').textContent = '';
    }

    return isValid;
}

// التحقق من صحة الخطوة 2
function validateStep2() {
    // كل الحقول في الخطوة 2 اختيارية، لذلك نعيد true دائماً
    return true;
}

// التحقق من صحة الخطوة 3
function validateStep3() {
    const agreeTerms = document.getElementById('agreeTerms').checked;
    const termsError = document.getElementById('termsError');

    if (!agreeTerms) {
        termsError.textContent = 'يجب الموافقة على الشروط والأحكام';
        return false;
    } else {
        termsError.textContent = '';
        return true;
    }
}

// التحقق من صحة الاسم
function validateName(name, errorElementId) {
    const errorElement = document.getElementById(errorElementId);

    if (!name) {
        errorElement.textContent = 'هذا الحقل مطلوب';
        return false;
    } else if (name.length < 2) {
        errorElement.textContent = 'يجب أن يكون الاسم على الأقل حرفين';
        return false;
    } else if (!/^[\u0600-\u06FF\s]+$/.test(name)) {
        errorElement.textContent = 'يجب أن يحتوي الاسم على أحرف عربية فقط';
        return false;
    } else {
        errorElement.textContent = '';
        return true;
    }
}

// التحقق من صحة البريد الإلكتروني
function validateEmail(email) {
    const errorElement = document.getElementById('emailError');

    if (!email) {
        errorElement.textContent = 'هذا الحقل مطلوب';
        return false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errorElement.textContent = 'البريد الإلكتروني غير صالح';
        return false;
    } else if (isEmailRegistered(email)) {
        errorElement.textContent = 'هذا البريد الإلكتروني مسجل بالفعل';
        return false;
    } else {
        errorElement.textContent = '';
        return true;
    }
}

// التحقق من صحة رقم الهاتف
function validatePhone(phone) {
    const errorElement = document.getElementById('phoneError');
    const saudiPhoneRegex = /^(05)[0-9]{8}$/;
    const EgyptPhoneRegex = /^(01)[0-9]{9}$/;

    if (!phone) {
        errorElement.textContent = 'هذا الحقل مطلوب';
        return false;
        // } else if (!saudiPhoneRegex.test(phone)) {
        //     errorElement.textContent = 'رقم الهاتف يجب أن يبدأ بـ  كود المشغل ويتكون من 10 أرقام';
        //     return false;
    } else if (!EgyptPhoneRegex.test(phone)) {
        errorElement.textContent = 'رقم الهاتف يجب أن يبدأ بـ  كود شبكة المحمول ويتكون من 11 رقم';
        return false;
    } else {
        errorElement.textContent = '';
        return true;
    }
}

// التحقق من صحة كلمة المرور
function validatePassword(password) {
    const errorElement = document.getElementById('passwordError');
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text');

    if (!password) {
        errorElement.textContent = 'هذا الحقل مطلوب';
        updatePasswordStrength(0, strengthBar, strengthText);
        return false;
    } else if (password.length < 8) {
        errorElement.textContent = 'يجب أن تكون كلمة المرور على الأقل 8 أحرف';
        updatePasswordStrength(1, strengthBar, strengthText);
        return false;
    } else {
        // قياس قوة كلمة المرور
        const strength = calculatePasswordStrength(password);
        updatePasswordStrength(strength, strengthBar, strengthText);

        if (strength < 3) {
            errorElement.textContent = 'كلمة المرور ضعيفة، يفضل استخدام أحرف كبيرة وصغيرة وأرقام ورموز';
            return false;
        } else {
            errorElement.textContent = '';
            return true;
        }
    }
}

// التحقق من تأكيد كلمة المرور
function validateConfirmPassword() {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const errorElement = document.getElementById('confirmPasswordError');

    if (!confirmPassword) {
        errorElement.textContent = 'هذا الحقل مطلوب';
        return false;
    } else if (password !== confirmPassword) {
        errorElement.textContent = 'كلمة المرور غير متطابقة';
        return false;
    } else {
        errorElement.textContent = '';
        return true;
    }
}

// التحقق من صحة تاريخ الميلاد
function validateDateOfBirth(dateOfBirth) {
    const errorElement = document.getElementById('dateOfBirthError');

    if (!dateOfBirth) {
        errorElement.textContent = 'هذا الحقل مطلوب';
        return false;
    } else {
        // حساب العمر
        const birthDate = new Date(dateOfBirth);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();

        if (age < 18) {
            errorElement.textContent = 'يجب أن يكون عمرك 18 سنة على الأقل';
            return false;
        } else {
            errorElement.textContent = '';
            return true;
        }
    }
}

// حساب قوة كلمة المرور
function calculatePasswordStrength(password) {
    let strength = 0;

    // طول كلمة المرور
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;

    // تنوع الأحرف
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    return Math.min(strength, 5); // الحد الأقصى 5 نقاط
}

// تحديث عرض قوة كلمة المرور
function updatePasswordStrength(strength, bar, text) {
    const strengthLevels = [
        { text: 'ضعيفة جداً', color: '#e74c3c', width: '20%' },
        { text: 'ضعيفة', color: '#e67e22', width: '40%' },
        { text: 'متوسطة', color: '#f1c40f', width: '60%' },
        { text: 'قوية', color: '#2ecc71', width: '80%' },
        { text: 'قوية جداً', color: '#27ae60', width: '100%' }
    ];

    const level = strengthLevels[strength] || strengthLevels[0];

    if (bar) {
        bar.style.width = level.width;
        bar.style.backgroundColor = level.color;
    }

    if (text) {
        text.textContent = `قوة كلمة المرور: ${level.text}`;
        text.style.color = level.color;
    }
}

// التحقق مما إذا كان البريد الإلكتروني مسجلاً بالفعل
function isEmailRegistered(email) {
    // محاكاة التحقق من قاعدة البيانات
    const registeredEmails = ['existing@email.com', 'test@medical.com'];
    return registeredEmails.includes(email.toLowerCase());
}

// تحديث تفاصيل التأكيد
function updateConfirmationDetails() {
    // الاسم الكامل
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    document.getElementById('confirmFullName').textContent = `${firstName} ${lastName}`;

    // البريد الإلكتروني
    document.getElementById('confirmEmail').textContent = document.getElementById('email').value;

    // رقم الهاتف
    document.getElementById('confirmPhone').textContent = document.getElementById('phone').value;

    // تاريخ الميلاد
    const birthDate = document.getElementById('dateOfBirth').value;
    if (birthDate) {
        const date = new Date(birthDate);
        document.getElementById('confirmBirthDate').textContent = date.toLocaleDateString('ar-SA');
    }

    // الجنس
    const genderInput = document.querySelector('input[name="gender"]:checked');
    if (genderInput) {
        const genderText = genderInput.value === 'male' ? 'ذكر' : 'أنثى';
        document.getElementById('confirmGender').textContent = genderText;
    }

    // فصيلة الدم
    const bloodType = document.getElementById('bloodType').value;
    if (bloodType) {
        document.getElementById('confirmBloodType').textContent = bloodType === 'unknown' ? 'غير معروف' : bloodType;
    } else {
        document.getElementById('confirmBloodType').textContent = 'غير محدد';
    }
}

// معالجة التسجيل
async function handleRegistration() {
    const registerForm = document.getElementById('registerForm');
    const createAccountBtn = document.getElementById('createAccountBtn');

    if (!registerForm || !createAccountBtn) return;

    // عرض حالة التحميل
    createAccountBtn.disabled = true;
    createAccountBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري إنشاء الحساب...';

    try {
        // جمع بيانات النموذج
        const formData = collectFormData();

        // محاكاة تأخير الشبكة
        await new Promise(resolve => setTimeout(resolve, 2000));

        // محاكاة إنشاء الحساب في قاعدة البيانات
        const registrationSuccess = await registerUser(formData);

        if (registrationSuccess) {
            // إظهار نافذة النجاح
            showSuccessModal();

            // حفظ بيانات المستخدم مؤقتاً (اختياري)
            sessionStorage.setItem('newUserEmail', formData.email);
        } else {
            throw new Error('فشل في إنشاء الحساب');
        }

    } catch (error) {
        // إظهار رسالة خطأ
        showNotification('حدث خطأ أثناء إنشاء الحساب. حاول مرة أخرى.', 'error');

        // إعادة تفعيل الزر
        createAccountBtn.disabled = false;
        createAccountBtn.innerHTML = '<i class="fas fa-user-plus"></i> إنشاء الحساب';
    }
}

// جمع بيانات النموذج
function collectFormData() {
    const genderInput = document.querySelector('input[name="gender"]:checked');

    return {
        firstName: document.getElementById('firstName').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        fullName: `${document.getElementById('firstName').value.trim()} ${document.getElementById('lastName').value.trim()}`,
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        password: document.getElementById('password').value,
        dateOfBirth: document.getElementById('dateOfBirth').value,
        gender: genderInput ? genderInput.value : null,
        bloodType: document.getElementById('bloodType').value,
        height: document.getElementById('height').value,
        weight: document.getElementById('weight').value,
        chronicDiseases: document.getElementById('chronicDiseases').value,
        allergies: document.getElementById('allergies').value,
        insuranceCompany: document.getElementById('insuranceCompany').value,
        insuranceNumber: document.getElementById('insuranceCompany').value === 'none' ? '' : document.getElementById('insuranceNumber').value,
        agreeTerms: document.getElementById('agreeTerms').checked,
        registrationDate: new Date().toISOString(),
        userType: 'patient', // نوع افتراضي
        isActive: true
    };
}

// محاكاة تسجيل المستخدم
async function registerUser(userData) {
    // محاكاة اتصال بالخادم
    return new Promise((resolve) => {
        setTimeout(() => {
            // تخزين بيانات المستخدم في localStorage (محاكاة لقاعدة البيانات)
            const users = JSON.parse(localStorage.getItem('medicalPlatformUsers') || '[]');

            // التحقق من عدم وجود مستخدم بنفس البريد الإلكتروني
            const existingUser = users.find(u => u.email === userData.email);
            if (existingUser) {
                showNotification('هذا البريد الإلكتروني مسجل بالفعل', 'error');
                resolve(false);
                return;
            }

            // إنشاء معرف فريد للمستخدم
            const userId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;

            // إضافة المستخدم الجديد
            const newUser = {
                id: userId,
                username: userData.email.split('@')[0],
                ...userData,
                // إزالة كلمة المرور قبل التخزين (في تطبيق حقيقي، يجب تشفيرها)
                password: '********', // في تطبيق حقيقي، يتم تخزين hash بدلاً من النص العادي
                role: 'patient'
            };

            users.push(newUser);
            localStorage.setItem('medicalPlatformUsers', JSON.stringify(users));

            resolve(true);
        }, 1500);
    });
}

// إظهار نافذة النجاح
function showSuccessModal() {
    const modal = document.getElementById('successModal');
    const userEmail = document.getElementById('email').value;

    if (modal) {
        // تحديث رسالة النجاح
        const successMessage = document.getElementById('successMessage');
        successMessage.textContent = `تم إنشاء حسابك بنجاح. تم إرسال رسالة تأكيد إلى ${userEmail}. يمكنك الآن تسجيل الدخول للاستفادة من خدماتنا.`;

        // إظهار النافذة
        modal.style.display = 'flex';

        // إضافة أنيميشن
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
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

// إغلاق نافذة النجاح
function closeSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
}

// تصدير الدوال للاستخدام في ملفات أخرى
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateStep1,
        validateStep2,
        validateStep3,
        registerUser,
        showSuccessModal,
        closeSuccessModal
    };
}