// تهيئة صفحة الخدمات
function initializeServicesPage() {
    loadServices();
    setupEventListeners();
    initializeBookingWizard();
    loadLabTests();
    setupFAQAccordion();
}

// تحميل الخدمات
// تحميل الخدمات مع صور من HTML
// تحميل الخدمات بعد اكتمال تحميل الصفحة
document.addEventListener('DOMContentLoaded', loadServices);

function loadServices() {
    const servicesGrid = document.getElementById('servicesGrid');
    if (!servicesGrid) return;

    // جلب الصور المخفية من HTML
    const serviceImages = {};
    for (let i = 1; i <= 6; i++) {
        const imgElement = document.getElementById(`service${i}-img`);
        if (imgElement) {
            serviceImages[i] = imgElement.src;
        } else {
            console.warn(`Image service${i}-img not found`);
        }
    }

    const services = [
        {
            id: 1,
            name: 'حجز موعد في العيادة',
            description: 'احجز موعداً مع أفضل الأطباء المتخصصين في عياداتنا المجهزة بأحدث التقنيات الطبية',
            icon: 'calendar-check',
            category: 'appointments',
            features: ['مواعيد مرنة', 'أطباء متخصصون', 'متابعة مستمرة', 'تقارير طبية'],
            price: '150 ريال',
            oldPrice: '200 ريال',
            badge: 'الأكثر طلباً',
            image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&h=400&fit=crop&q=80'
        },
        {
            id: 2,
            name: 'استشارة طبية عن بعد',
            description: 'استشارة طبية عبر الفيديو مع أطباء معتمدين، مع إمكانية الحصول على وصفات طبية إلكترونية',
            icon: 'video',
            category: 'telemedicine',
            features: ['مكالمة فيديو آمنة', 'وصفات إلكترونية', 'دعم تقني', 'تسجيل الجلسة'],
            price: '200 ريال',
            oldPrice: '250 ريال',
            badge: 'جديد',
            image: serviceImages[2]
        },
        {
            id: 3,
            name: 'الكشف المنزلي',
            description: 'خدمة طبية متكاملة في منزلك مع فريق طبي متخصص وأجهزة طبية متحركة',
            icon: 'home',
            category: 'homecare',
            features: ['فحص شامل', 'حقن وعلاجات', 'تحاليل منزلية', 'متابعة أسبوعية'],
            price: '300 ريال',
            oldPrice: '400 ريال',
            badge: 'مميز',
            image: serviceImages[3]
        },
        {
            id: 4,
            name: 'تحاليل الدم الشاملة',
            description: 'حزمة متكاملة من التحاليل الطبية الدقيقة مع سحب عينات من المنزل وتقرير مفصل',
            icon: 'flask',
            category: 'lab',
            features: ['سحب عينات منزلي', 'نتائج سريعة', 'تقرير مفصل', 'استشارة مجانية'],
            price: '199 ريال',
            oldPrice: '299 ريال',
            badge: 'خصم 33%',
            image: serviceImages[4]
        },
        {
            id: 5,
            name: 'فحص القلب والأوعية الدموية',
            description: 'فحص متكامل للقلب والشرايين مع تخطيط القلب وفحص الجهد',
            icon: 'heartbeat',
            category: 'appointments',
            features: ['تخطيط القلب', 'فحص الجهد', 'استشارة متخصصة', 'خطة علاجية'],
            price: '450 ريال',
            oldPrice: '550 ريال',
            badge: null,
            image: serviceImages[5]
        },
        {
            id: 6,
            name: 'استشارة تغذية علاجية',
            description: 'خطط تغذية شخصية مع متابعة مستمرة لتحقيق أهدافك الصحية والوزنية',
            icon: 'apple-alt',
            category: 'telemedicine',
            features: ['تحليل جسمي', 'خطط شخصية', 'متابعة أسبوعية', 'دعم مباشر'],
            price: '250 ريال',
            oldPrice: '350 ريال',
            badge: null,
            image: serviceImages[6]
        }
    ];

    servicesGrid.innerHTML = '';

    services.forEach(service => {
        const serviceCard = createServiceCard(service);
        servicesGrid.appendChild(serviceCard);
    });
}


// إنشاء بطاقة خدمة
function createServiceCard(service) {
    const card = document.createElement('div');
    card.className = 'service-card';
    card.setAttribute('data-category', service.category);

    let badgeHTML = '';
    if (service.badge) {
        badgeHTML = `<div class="service-badge">${service.badge}</div>`;
    }

    card.innerHTML = `
        ${badgeHTML}
        <div class="service-image">
            <img src="${service.image || 'images/default-service.jpg'}" 
                 alt="${service.name}"
                 loading="lazy">
        </div>
        <div class="service-content">
            <div class="service-icon">
                <i class="fas fa-${service.icon}"></i>
            </div>
            <h3>${service.name}</h3>
            <p>${service.description}</p>
            <ul class="service-features">
                ${service.features.map(feature => `<li><i class="fas fa-check"></i> ${feature}</li>`).join('')}
            </ul>
            <div class="service-footer">
                <div class="service-price">
                    ${service.price}
                    ${service.oldPrice ? `<span class="old-price">${service.oldPrice}</span>` : ''}
                </div>
                <button class="btn btn-primary" onclick="bookService(${service.id})">
                    <i class="fas fa-calendar-alt"></i> احجز الآن
                </button>
            </div>
        </div>
    `;

    return card;
}
// إعداد مستمعي الأحداث
function setupEventListeners() {
    // تصفية الخدمات
    const filterTabs = document.querySelectorAll('.filter-tab');
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function () {
            const category = this.getAttribute('data-category');
            filterServices(category);

            // تحديث التبويب النشط
            filterTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // البحث في الخدمات
    const serviceSearch = document.getElementById('serviceSearch');
    if (serviceSearch) {
        serviceSearch.addEventListener('input', function () {
            searchServices(this.value);
        });
    }

    // زر البحث
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', function () {
            searchServices(serviceSearch.value);
        });
    }
}

// تصفية الخدمات حسب التصنيف
function filterServices(category) {
    const services = document.querySelectorAll('.service-card');
    const searchInput = document.getElementById('serviceSearch');

    services.forEach(service => {
        if (category === 'all' || service.getAttribute('data-category') === category) {
            service.style.display = 'block';
        } else {
            service.style.display = 'none';
        }
    });

    // إعادة تعيين البحث
    if (searchInput) {
        searchInput.value = '';
    }
}

// البحث في الخدمات
function searchServices(query) {
    const services = document.querySelectorAll('.service-card');
    const normalizedQuery = query.toLowerCase().trim();

    services.forEach(service => {
        const serviceName = service.querySelector('h3').textContent.toLowerCase();
        const serviceDesc = service.querySelector('p').textContent.toLowerCase();

        if (serviceName.includes(normalizedQuery) || serviceDesc.includes(normalizedQuery)) {
            service.style.display = 'block';
        } else {
            service.style.display = 'none';
        }
    });
}

// تهيئة معالج حجز المواعيد
function initializeBookingWizard() {
    setupBookingSteps();
    loadDoctors();
    initializeCalendar();
    setupBookingForm();
}

// إعداد خطوات الحجز
function setupBookingSteps() {
    // الخطوة 1: اختيار الخدمة
    const serviceOptions = document.querySelectorAll('.service-option');
    let selectedService = null;

    serviceOptions.forEach(option => {
        option.addEventListener('click', function () {
            // إزالة التحديد من جميع الخيارات
            serviceOptions.forEach(opt => opt.classList.remove('selected'));

            // تحديد الخيار الحالي
            this.classList.add('selected');
            selectedService = this.getAttribute('data-service');

            // تفعيل الزر التالي
            document.getElementById('nextToStep2').disabled = false;
        });
    });

    // الانتقال للخطوة 2
    const nextToStep2 = document.getElementById('nextToStep2');
    if (nextToStep2) {
        nextToStep2.addEventListener('click', function () {
            if (selectedService) {
                goToBookingStep(2);
                updateConfirmation('service', getServiceName(selectedService));
                updateConfirmation('price', getServicePrice(selectedService));
                updateConfirmation('duration', getServiceDuration(selectedService));
            }
        });
    }

    // العودة للخطوة 1
    const backToStep1 = document.getElementById('backToStep1');
    if (backToStep1) {
        backToStep1.addEventListener('click', function () {
            goToBookingStep(1);
        });
    }

    // الخطوة 2: اختيار القسم والطبيب
    const departmentSelect = document.getElementById('departmentSelect');
    const doctorSelect = document.getElementById('doctorSelect');
    let selectedDoctor = null;

    if (departmentSelect) {
        departmentSelect.addEventListener('change', function () {
            const department = this.value;
            if (department) {
                // تفعيل قائمة الأطباء
                doctorSelect.disabled = false;
                doctorSelect.innerHTML = '<option value="">اختر الطبيب</option>';

                // تحميل الأطباء حسب القسم
                const doctors = getDoctorsByDepartment(department);
                doctors.forEach(doctor => {
                    const option = document.createElement('option');
                    option.value = doctor.id;
                    option.textContent = doctor.name;
                    doctorSelect.appendChild(option);
                });

                // عرض قائمة الأطباء
                displayDoctorsList(department);
            } else {
                doctorSelect.disabled = true;
                doctorSelect.innerHTML = '<option value="">اختر الطبيب</option>';
                document.getElementById('doctorsList').innerHTML = '';
            }

            // تعطيل الزر التالي
            document.getElementById('nextToStep3').disabled = true;
            selectedDoctor = null;
        });
    }

    if (doctorSelect) {
        doctorSelect.addEventListener('change', function () {
            const doctorId = this.value;
            if (doctorId) {
                selectedDoctor = getDoctorById(doctorId);

                // تحديث قائمة الأطباء
                const doctorCards = document.querySelectorAll('.doctor-card');
                doctorCards.forEach(card => {
                    card.classList.remove('selected');
                    if (card.getAttribute('data-doctor-id') === doctorId) {
                        card.classList.add('selected');
                    }
                });

                // تفعيل الزر التالي
                document.getElementById('nextToStep3').disabled = false;

                // تحديث تفاصيل التأكيد
                updateConfirmation('doctor', selectedDoctor.name);
            } else {
                selectedDoctor = null;
                document.getElementById('nextToStep3').disabled = true;
            }
        });
    }

    // الانتقال للخطوة 3
    const nextToStep3 = document.getElementById('nextToStep3');
    if (nextToStep3) {
        nextToStep3.addEventListener('click', function () {
            if (selectedDoctor) {
                goToBookingStep(3);
            }
        });
    }

    // العودة للخطوة 2
    const backToStep2 = document.getElementById('backToStep2');
    if (backToStep2) {
        backToStep2.addEventListener('click', function () {
            goToBookingStep(2);
        });
    }

    // الخطوة 3: اختيار التاريخ والوقت
    let selectedDate = null;
    let selectedTime = null;

    // العودة للخطوة 3
    const backToStep3 = document.getElementById('backToStep3');
    if (backToStep3) {
        backToStep3.addEventListener('click', function () {
            goToBookingStep(3);
        });
    }
}

// الانتقال بين خطوات الحجز
function goToBookingStep(stepNumber) {
    // إخفاء جميع الخطوات
    const steps = document.querySelectorAll('.booking-step');
    steps.forEach(step => {
        step.classList.remove('active');
    });

    // إظهار الخطوة المطلوبة
    const currentStep = document.getElementById(`step${stepNumber}`);
    if (currentStep) {
        currentStep.classList.add('active');
    }

    // التمرير لأعلى القسم
    document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
}

// تحميل الأطباء
function loadDoctors() {
    // بيانات الأطباء (يمكن تحميلها من قاعدة بيانات)
    window.doctorsData = [
        { id: 1, name: 'د. أحمد محمد', specialty: 'استشاري أمراض القلب', department: 'cardiology', rating: 4.8 },
        { id: 2, name: 'د. سارة خالد', specialty: 'استشارية طب الأطفال', department: 'pediatrics', rating: 4.9 },
        { id: 3, name: 'د. خالد فهد', specialty: 'استشاري طب الأعصاب', department: 'neurology', rating: 4.7 },
        { id: 4, name: 'د. فاطمة علي', specialty: 'استشارية طب العيون', department: 'ophthalmology', rating: 4.8 },
        { id: 5, name: 'د. محمد سعيد', specialty: 'أخصائي طب الأسنان', department: 'dentistry', rating: 4.6 },
        { id: 6, name: 'د. نورة عبدالله', specialty: 'أخصائية العلاج الطبيعي', department: 'physiotherapy', rating: 4.9 },
        { id: 7, name: 'د. عمر السيد', specialty: 'طبيب عام', department: 'general', rating: 4.7 }
    ];
}

// الحصول على الأطباء حسب القسم
function getDoctorsByDepartment(department) {
    if (!window.doctorsData) return [];
    return window.doctorsData.filter(doctor => doctor.department === department);
}

// الحصول على الطبيب حسب المعرف
function getDoctorById(doctorId) {
    if (!window.doctorsData) return null;
    return window.doctorsData.find(doctor => doctor.id.toString() === doctorId);
}

// عرض قائمة الأطباء
function displayDoctorsList(department) {
    const doctorsList = document.getElementById('doctorsList');
    const doctors = getDoctorsByDepartment(department);

    if (!doctorsList || doctors.length === 0) return;

    doctorsList.innerHTML = '';
    doctors.forEach(doctor => {
        const doctorCard = document.createElement('div');
        doctorCard.className = 'doctor-card';
        doctorCard.setAttribute('data-doctor-id', doctor.id);
        doctorCard.innerHTML = `
            <div class="doctor-avatar">
                <i class="fas fa-user-md"></i>
            </div>
            <div class="doctor-info">
                <h4>${doctor.name}</h4>
                <p class="doctor-specialty">${doctor.specialty}</p>
                <div class="doctor-rating">
                    <i class="fas fa-star"></i> ${doctor.rating}
                </div>
            </div>
        `;

        doctorCard.addEventListener('click', function () {
            // تحديث التحديد
            document.querySelectorAll('.doctor-card').forEach(card => {
                card.classList.remove('selected');
            });
            this.classList.add('selected');

            // تحديث القائمة المنسدلة
            document.getElementById('doctorSelect').value = doctor.id;

            // تفعيل الزر التالي
            document.getElementById('nextToStep3').disabled = false;

            // تحديث تفاصيل التأكيد
            updateConfirmation('doctor', doctor.name);
        });

        doctorsList.appendChild(doctorCard);
    });
}

// تهيئة التقويم
function initializeCalendar() {
    const calendar = document.getElementById('calendar');
    if (!calendar) return;

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // إنشاء التقويم للشهر الحالي
    createCalendar(currentMonth, currentYear);

    // إعداد التنقل بين الأشهر
    setupCalendarNavigation();
}

// إنشاء التقويم
function createCalendar(month, year) {
    const calendar = document.getElementById('calendar');
    if (!calendar) return;

    // تواريخ عطلة نهاية الأسبوع (الجمعة والسبت)
    const weekendDays = [5, 6]; // 5 = الجمعة، 6 = السبت

    const monthNames = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
        'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];

    const dayNames = ['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];

    // مسح التقويم الحالي
    calendar.innerHTML = '';

    // رأس التقويم
    const header = document.createElement('div');
    header.className = 'calendar-header';
    header.innerHTML = `
        <button id="prevMonth"><i class="fas fa-chevron-right"></i></button>
        <span>${monthNames[month]} ${year}</span>
        <button id="nextMonth"><i class="fas fa-chevron-left"></i></button>
    `;
    calendar.appendChild(header);

    // أيام الأسبوع
    const daysHeader = document.createElement('div');
    daysHeader.className = 'calendar-grid';

    dayNames.forEach(day => {
        const dayElement = document.createElement('div');
        dayElement.className = 'day-name';
        dayElement.textContent = day;
        daysHeader.appendChild(dayElement);
    });

    calendar.appendChild(daysHeader);

    // الأيام
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const daysGrid = document.createElement('div');
    daysGrid.className = 'calendar-grid';

    // أيام فارغة قبل بداية الشهر
    for (let i = 0; i < startingDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'day empty';
        daysGrid.appendChild(emptyDay);
    }

    // أيام الشهر
    const today = new Date();

    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'day';
        dayElement.textContent = day;

        const currentDate = new Date(year, month, day);

        // التحقق مما إذا كان اليوم ماضياً
        if (currentDate < today) {
            dayElement.classList.add('disabled');
        }

        // التحقق مما إذا كان اليوم عطلة نهاية الأسبوع
        if (weekendDays.includes(currentDate.getDay())) {
            dayElement.classList.add('disabled');
        }

        // إضافة حدث النقر
        if (!dayElement.classList.contains('disabled')) {
            dayElement.addEventListener('click', function () {
                // إزالة التحديد من جميع الأيام
                document.querySelectorAll('.day').forEach(d => {
                    d.classList.remove('selected');
                });

                // تحديد اليوم الحالي
                this.classList.add('selected');

                // حفظ التاريخ المختار
                const selectedDate = new Date(year, month, day);
                window.selectedBookingDate = selectedDate;

                // تحديث تفاصيل التأكيد
                const dateStr = selectedDate.toLocaleDateString('ar-SA', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
                updateConfirmation('date', dateStr);

                // تحميل الأوقات المتاحة
                loadTimeSlots();

                // تفعيل الزر التالي إذا تم اختيار الوقت
                if (window.selectedBookingTime) {
                    document.getElementById('nextToStep4').disabled = false;
                }
            });
        }

        daysGrid.appendChild(dayElement);
    }

    calendar.appendChild(daysGrid);
}

// إعداد تنقل التقويم
function setupCalendarNavigation() {
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();

    document.addEventListener('click', function (e) {
        if (e.target.id === 'prevMonth' || e.target.closest('#prevMonth')) {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            createCalendar(currentMonth, currentYear);
        }

        if (e.target.id === 'nextMonth' || e.target.closest('#nextMonth')) {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            createCalendar(currentMonth, currentYear);
        }
    });
}

// تحميل الأوقات المتاحة
function loadTimeSlots() {
    const timeSlots = document.getElementById('timeSlots');
    if (!timeSlots) return;

    // مسح الأوقات الحالية
    timeSlots.innerHTML = '';

    // الأوقات المتاحة (يمكن جلبها من قاعدة بيانات حسب الطبيب)
    const availableTimes = [
        '08:00 ص', '09:00 ص', '10:00 ص', '11:00 ص',
        '12:00 م', '01:00 م', '02:00 م', '03:00 م',
        '04:00 م', '05:00 م', '06:00 م', '07:00 م'
    ];

    // الأوقات المحجوزة (يمكن جلبها من قاعدة بيانات)
    const bookedTimes = ['10:00 ص', '02:00 م', '05:00 م'];

    availableTimes.forEach(time => {
        const slot = document.createElement('div');
        slot.className = 'time-slot';
        slot.textContent = time;

        if (bookedTimes.includes(time)) {
            slot.classList.add('disabled');
        } else {
            slot.addEventListener('click', function () {
                // إزالة التحديد من جميع الأوقات
                document.querySelectorAll('.time-slot').forEach(s => {
                    s.classList.remove('selected');
                });

                // تحديد الوقت الحالي
                this.classList.add('selected');

                // حفظ الوقت المختار
                window.selectedBookingTime = time;

                // تحديث تفاصيل التأكيد
                updateConfirmation('time', time);

                // تفعيل الزر التالي
                document.getElementById('nextToStep4').disabled = false;

                // الانتقال للخطوة التالية تلقائياً
                setTimeout(() => {
                    document.getElementById('nextToStep4').click();
                }, 500);
            });
        }

        timeSlots.appendChild(slot);
    });
}

// إعداد نموذج الحجز
function setupBookingForm() {
    // الانتقال للخطوة 4
    const nextToStep4 = document.getElementById('nextToStep4');
    if (nextToStep4) {
        nextToStep4.addEventListener('click', function () {
            if (window.selectedBookingDate && window.selectedBookingTime) {
                goToBookingStep(4);

                // ملء بيانات المريض إذا كان مسجلاً
                const user = JSON.parse(localStorage.getItem('medicalPlatformUser') || sessionStorage.getItem('medicalPlatformUser'));
                if (user) {
                    document.getElementById('patientName').value = user.fullName || '';
                    document.getElementById('patientEmail').value = user.email || '';
                    document.getElementById('patientPhone').value = user.phone || '';
                }
            }
        });
    }

    // التحقق من نموذج المريض
    const patientForm = document.getElementById('patientForm');
    const confirmBookingBtn = document.getElementById('confirmBooking');

    if (patientForm && confirmBookingBtn) {
        // تفعيل زر التأكيد عند اكتمال النموذج
        const inputs = patientForm.querySelectorAll('input[required], textarea[required]');
        inputs.forEach(input => {
            input.addEventListener('input', function () {
                const allFilled = Array.from(inputs).every(input => input.value.trim() !== '');
                confirmBookingBtn.disabled = !allFilled;
            });
        });

        // تأكيد الحجز
        confirmBookingBtn.addEventListener('click', function () {
            if (validatePatientForm()) {
                completeBooking();
            }
        });
    }
}

// التحقق من نموذج المريض
function validatePatientForm() {
    const name = document.getElementById('patientName').value.trim();
    const phone = document.getElementById('patientPhone').value.trim();
    const email = document.getElementById('patientEmail').value.trim();

    let isValid = true;

    // التحقق من الاسم
    if (!name || name.length < 2) {
        showFormError('الرجاء إدخال اسم صحيح');
        isValid = false;
    }

    // التحقق من الهاتف
    if (!phone || !/^(05)[0-9]{8}$/.test(phone)) {
        showFormError('رقم الهاتف يجب أن يبدأ بـ 05 ويتكون من 10 أرقام');
        isValid = false;
    }

    // التحقق من البريد الإلكتروني
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showFormError('الرجاء إدخال بريد إلكتروني صحيح');
        isValid = false;
    }

    return isValid;
}

// إظهار خطأ في النموذج
function showFormError(message) {
    // إزالة أي أخطاء سابقة
    const existingError = document.querySelector('.form-error');
    if (existingError) {
        existingError.remove();
    }

    // إنشاء رسالة الخطأ
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-error';
    errorDiv.style.cssText = `
        background: #f8d7da;
        color: #721c24;
        padding: 15px;
        border-radius: 8px;
        margin: 20px 0;
        text-align: center;
        font-weight: 600;
    `;
    errorDiv.textContent = message;

    // إضافة الرسالة قبل زر التأكيد
    const confirmBtn = document.getElementById('confirmBooking');
    if (confirmBtn) {
        confirmBtn.parentNode.insertBefore(errorDiv, confirmBtn);
    }

    // إزالة الرسالة بعد 5 ثوانٍ
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
    }, 5000);
}

// إكمال عملية الحجز
function completeBooking() {
    const bookingBtn = document.getElementById('confirmBooking');

    // عرض حالة التحميل
    bookingBtn.disabled = true;
    bookingBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري تأكيد الحجز...';

    // محاكاة تأخير الشبكة
    setTimeout(() => {
        // إنشاء رقم حجز عشوائي
        const bookingNumber = '#' + Math.floor(1000 + Math.random() * 9000);

        // عرض نافذة التأكيد
        showBookingConfirmation(bookingNumber);

        // إعادة تعيين الزر
        bookingBtn.disabled = false;
        bookingBtn.innerHTML = '<i class="fas fa-check"></i> تأكيد الحجز';

        // إعادة تعيين النموذج
        resetBookingForm();
    }, 1500);
}

// إعادة تعيين نموذج الحجز
function resetBookingForm() {
    // إعادة تعيين جميع الخيارات
    document.querySelectorAll('.service-option').forEach(opt => {
        opt.classList.remove('selected');
    });

    document.getElementById('departmentSelect').selectedIndex = 0;
    document.getElementById('doctorSelect').disabled = true;
    document.getElementById('doctorSelect').innerHTML = '<option value="">اختر الطبيب</option>';
    document.getElementById('doctorsList').innerHTML = '';

    // إعادة تعيين التقويم والوقت
    window.selectedBookingDate = null;
    window.selectedBookingTime = null;

    // إعادة تعيين نموذج المريض
    document.getElementById('patientForm').reset();

    // العودة للخطوة الأولى
    goToBookingStep(1);
}

// تحديث تفاصيل التأكيد
function updateConfirmation(field, value) {
    const elements = {
        service: 'confirmService',
        doctor: 'confirmDoctor',
        date: 'confirmDate',
        time: 'confirmTime',
        duration: 'confirmDuration',
        price: 'confirmPrice'
    };

    if (elements[field]) {
        document.getElementById(elements[field]).textContent = value;
    }
}

// الحصول على اسم الخدمة
function getServiceName(serviceType) {
    const serviceNames = {
        'consultation': 'استشارة طبية في العيادة',
        'telemedicine': 'استشارة طبية عن بعد',
        'home-visit': 'الكشف المنزلي',
        'lab-test': 'تحاليل طبية'
    };

    return serviceNames[serviceType] || 'خدمة طبية';
}

// الحصول على سعر الخدمة
function getServicePrice(serviceType) {
    const servicePrices = {
        'consultation': '150 ريال',
        'telemedicine': '200 ريال',
        'home-visit': '300 ريال',
        'lab-test': 'من 100 ريال'
    };

    return servicePrices[serviceType] || '0 ريال';
}

// الحصول على مدة الخدمة
function getServiceDuration(serviceType) {
    const serviceDurations = {
        'consultation': '30 دقيقة',
        'telemedicine': '45 دقيقة',
        'home-visit': '60-90 دقيقة',
        'lab-test': '15 دقيقة'
    };

    return serviceDurations[serviceType] || '30 دقيقة';
}

// الحجز المباشر للخدمة
function bookService(serviceId) {
    // الانتقال لقسم الحجز
    document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });

    // اختيار الخدمة المناسبة
    setTimeout(() => {
        const serviceOptions = document.querySelectorAll('.service-option');
        serviceOptions.forEach(option => {
            if (option.getAttribute('data-service') === getServiceTypeById(serviceId)) {
                option.click();
            }
        });
    }, 500);
}

// الحصول على نوع الخدمة حسب المعرف
function getServiceTypeById(serviceId) {
    const serviceTypes = {
        1: 'consultation',
        2: 'telemedicine',
        3: 'home-visit',
        4: 'lab-test',
        5: 'consultation',
        6: 'telemedicine'
    };

    return serviceTypes[serviceId] || 'consultation';
}

// تحميل التحاليل الطبية
function loadLabTests() {
    const testsGrid = document.getElementById('testsGrid');
    if (!testsGrid) return;

    const tests = {
        blood: [
            { name: 'صورة الدم الكاملة', description: 'CBC تحليل شامل لمكونات الدم', price: '50 ريال' },
            { name: 'تحليل السكر', description: 'قياس مستوى السكر في الدم', price: '30 ريال' },
            { name: 'تحليل وظائف الكبد', description: 'Liver Function Tests', price: '80 ريال' },
            { name: 'تحليل وظائف الكلى', description: 'Kidney Function Tests', price: '70 ريال' },
            { name: 'تحليل الدهون', description: 'مستوى الكوليسترول والدهون', price: '60 ريال' }
        ],
        urine: [
            { name: 'تحليل البول الروتيني', description: 'فحص شامل للبول', price: '40 ريال' },
            { name: 'تحليل البول 24 ساعة', description: 'تحليل متكامل للبول', price: '90 ريال' }
        ],
        hormones: [
            { name: 'تحليل الغدة الدرقية', description: 'TSH, T3, T4', price: '120 ريال' },
            { name: 'تحليل هرمون النمو', description: 'Growth Hormone Test', price: '150 ريال' }
        ],
        genetic: [
            { name: 'تحليل الحمض النووي', description: 'DNA Analysis', price: '500 ريال' },
            { name: 'فحص ما قبل الزواج', description: 'Premarital Screening', price: '300 ريال' }
        ],
        allergy: [
            { name: 'فحص الحساسية العام', description: 'Allergy Screening', price: '200 ريال' },
            { name: 'فحص حساسية الطعام', description: 'Food Allergy Test', price: '250 ريال' }
        ]
    };

    // عرض تحاليل الدم افتراضياً
    displayLabTests('blood');

    // إعداد تصفية التحاليل
    const categoryTabs = document.querySelectorAll('.category-tab');
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', function () {
            // تحديث التبويب النشط
            categoryTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            // عرض التحاليل حسب التصنيف
            const category = this.getAttribute('data-category');
            displayLabTests(category);
        });
    });
}

// عرض التحاليل حسب التصنيف
function displayLabTests(category) {
    const testsGrid = document.getElementById('testsGrid');
    if (!testsGrid) return;

    const tests = {
        blood: [
            { name: 'صورة الدم الكاملة', description: 'CBC تحليل شامل لمكونات الدم', price: '50 ريال' },
            { name: 'تحليل السكر', description: 'قياس مستوى السكر في الدم', price: '30 ريال' },
            { name: 'تحليل وظائف الكبد', description: 'Liver Function Tests', price: '80 ريال' },
            { name: 'تحليل وظائف الكلى', description: 'Kidney Function Tests', price: '70 ريال' },
            { name: 'تحليل الدهون', description: 'مستوى الكوليسترول والدهون', price: '60 ريال' },
            { name: 'تحليل فيتامين د', description: 'Vitamin D Test', price: '90 ريال' }
        ],
        urine: [
            { name: 'تحليل البول الروتيني', description: 'فحص شامل للبول', price: '40 ريال' },
            { name: 'تحليل البول 24 ساعة', description: 'تحليل متكامل للبول', price: '90 ريال' },
            { name: 'تحليل الزلال في البول', description: 'Urine Albumin Test', price: '60 ريال' }
        ],
        hormones: [
            { name: 'تحليل الغدة الدرقية', description: 'TSH, T3, T4', price: '120 ريال' },
            { name: 'تحليل هرمون النمو', description: 'Growth Hormone Test', price: '150 ريال' },
            { name: 'تحليل هرمونات الغدة', description: 'Thyroid Panel', price: '200 ريال' }
        ],
        genetic: [
            { name: 'تحليل الحمض النووي', description: 'DNA Analysis', price: '500 ريال' },
            { name: 'فحص ما قبل الزواج', description: 'Premarital Screening', price: '300 ريال' },
            { name: 'فحص الأمراض الوراثية', description: 'Genetic Disorder Screening', price: '400 ريال' }
        ],
        allergy: [
            { name: 'فحص الحساسية العام', description: 'Allergy Screening', price: '200 ريال' },
            { name: 'فحص حساسية الطعام', description: 'Food Allergy Test', price: '250 ريال' },
            { name: 'فحص حساسية الأدوية', description: 'Drug Allergy Test', price: '180 ريال' }
        ]
    };

    const categoryTests = tests[category] || [];

    testsGrid.innerHTML = '';
    categoryTests.forEach(test => {
        const testItem = document.createElement('div');
        testItem.className = 'test-item';
        testItem.innerHTML = `
            <div class="test-info">
                <h4>${test.name}</h4>
                <p>${test.description}</p>
            </div>
            <div class="test-price">${test.price}</div>
        `;

        testItem.addEventListener('click', function () {
            bookLabTest(test.name, test.price);
        });

        testsGrid.appendChild(testItem);
    });
}

// حجز تحليل طبي
function bookLabTest(testName, testPrice) {
    // الانتقال لقسم الحجز
    document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });

    // اختيار خدمة التحاليل
    setTimeout(() => {
        const labOption = document.querySelector('.service-option[data-service="lab-test"]');
        if (labOption) {
            labOption.click();

            // تحديث تفاصيل الحجز
            setTimeout(() => {
                updateConfirmation('service', `تحليل: ${testName}`);
                updateConfirmation('price', testPrice);
                updateConfirmation('duration', '15 دقيقة');
            }, 300);
        }
    }, 500);
}

// إعداد الأسئلة الشائعة
function setupFAQAccordion() {
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', function () {
            const faqItem = this.parentElement;
            const isActive = faqItem.classList.contains('active');

            // إغلاق جميع الأسئلة الأخرى
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });

            // فتح/إغلاق السؤال الحالي
            if (!isActive) {
                faqItem.classList.add('active');
            }
        });
    });
}

// إظهار تأكيد الحجز
function showBookingConfirmation(bookingNumber) {
    const modal = document.getElementById('bookingModal');
    const bookingMessage = document.getElementById('bookingMessage');
    const bookingNumberEl = document.getElementById('bookingNumber');
    const modalDate = document.getElementById('modalDate');
    const modalTime = document.getElementById('modalTime');

    if (modal && bookingMessage) {
        // تحديث تفاصيل الحجز
        bookingNumberEl.textContent = bookingNumber;
        modalDate.textContent = document.getElementById('confirmDate').textContent;
        modalTime.textContent = document.getElementById('confirmTime').textContent;

        // تحديث الرسالة
        const patientName = document.getElementById('patientName').value;
        const patientEmail = document.getElementById('patientEmail').value;
        bookingMessage.textContent = `تم تأكيد حجز موعد ${document.getElementById('confirmService').textContent} مع ${document.getElementById('confirmDoctor').textContent} يوم ${modalDate.textContent} الساعة ${modalTime.textContent}. تم إرسال تفاصيل الحجز إلى ${patientEmail}.`;

        // إظهار النافذة
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);

        // حفظ الحجز في localStorage (محاكاة لقاعدة البيانات)
        saveBookingToStorage(bookingNumber, patientName, patientEmail);
    }
}

// حفظ الحجز في التخزين المحلي
function saveBookingToStorage(bookingNumber, patientName, patientEmail) {
    const bookings = JSON.parse(localStorage.getItem('medicalPlatformBookings') || '[]');

    const newBooking = {
        id: bookingNumber,
        patientName: patientName,
        patientEmail: patientEmail,
        service: document.getElementById('confirmService').textContent,
        doctor: document.getElementById('confirmDoctor').textContent,
        date: document.getElementById('confirmDate').textContent,
        time: document.getElementById('confirmTime').textContent,
        price: document.getElementById('confirmPrice').textContent,
        status: 'confirmed',
        bookingDate: new Date().toISOString()
    };

    bookings.push(newBooking);
    localStorage.setItem('medicalPlatformBookings', JSON.stringify(bookings));
}

// إغلاق نافذة الحجز
function closeBookingModal() {
    const modal = document.getElementById('bookingModal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
}

// طباعة تفاصيل الحجز
function printBooking() {
    const printContent = `
        <div style="font-family: 'Cairo', sans-serif; text-align: right; direction: rtl; padding: 20px;">
            <h2 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">
                <i class="fas fa-stethoscope"></i> المنصة الطبية
            </h2>
            <h3 style="color: #3498db;">تأكيد الحجز</h3>
            
            <table style="width: 100%; margin: 20px 0; border-collapse: collapse;">
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd; color: #7f8c8d;"><strong>رقم الحجز:</strong></td>
                    <td style="padding: 10px; border: 1px solid #ddd; color: #2c3e50;"><strong>${document.getElementById('bookingNumber').textContent}</strong></td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd; color: #7f8c8d;">الخدمة:</td>
                    <td style="padding: 10px; border: 1px solid #ddd; color: #2c3e50;">${document.getElementById('confirmService').textContent}</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd; color: #7f8c8d;">الطبيب:</td>
                    <td style="padding: 10px; border: 1px solid #ddd; color: #2c3e50;">${document.getElementById('confirmDoctor').textContent}</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd; color: #7f8c8d;">التاريخ:</td>
                    <td style="padding: 10px; border: 1px solid #ddd; color: #2c3e50;">${document.getElementById('modalDate').textContent}</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd; color: #7f8c8d;">الوقت:</td>
                    <td style="padding: 10px; border: 1px solid #ddd; color: #2c3e50;">${document.getElementById('modalTime').textContent}</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd; color: #7f8c8d;">المبلغ:</td>
                    <td style="padding: 10px; border: 1px solid #ddd; color: #2ecc71; font-weight: bold;">${document.getElementById('confirmPrice').textContent}</td>
                </tr>
            </table>
            
            <div style="margin-top: 30px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                <p style="color: #7f8c8d; margin: 0;">
                    <strong>ملاحظات:</strong><br>
                    - يرجى الحضور قبل الموعد بـ 15 دقيقة<br>
                    - إحضار الهوية الوطنية وبطاقة التأمين (إن وجدت)<br>
                    - يمكن إلغاء الموعد قبل 24 ساعة<br>
                    - للاستفسار: 0112345678
                </p>
            </div>
            
            <div style="margin-top: 40px; text-align: center; color: #7f8c8d; font-size: 12px;">
                <p>© المنصة الطبية. جميع الحقوق محفوظة.</p>
                <p>© 2026 Designed By Emad Multimedia</p>
                <p>تم الإنشاء: ${new Date().toLocaleDateString('ar-SA')}</p>
            </div>
        </div>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
            <meta charset="UTF-8">
            <title>تأكيد الحجز - المنصة الطبية</title>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
            <style>
                @media print {
                    body { margin: 0; }
                    .no-print { display: none; }
                }
            </style>
        </head>
        <body>
            ${printContent}
            <div class="no-print" style="text-align: center; margin-top: 20px;">
                <button onclick="window.print()" style="padding: 10px 20px; background: #3498db; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    <i class="fas fa-print"></i> طباعة
                </button>
                <button onclick="window.close()" style="padding: 10px 20px; background: #7f8c8d; color: white; border: none; border-radius: 5px; cursor: pointer; margin-right: 10px;">
                    <i class="fas fa-times"></i> إغلاق
                </button>
            </div>
        </body>
        </html>
    `);
    printWindow.document.close();
}

// تصدير الدوال للاستخدام العالمي
window.bookService = bookService;
window.closeBookingModal = closeBookingModal;

window.printBooking = printBooking;

