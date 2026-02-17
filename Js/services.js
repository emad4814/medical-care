// =============================
// services.js - Super Lux Functionality
// =============================

// DOM Elements
const servicesGrid = document.getElementById('appointment');
const filterTabs = document.querySelectorAll('.filter-tab');
const noResults = document.getElementById('noResults');

// Booking Wizard Elements
const steps = document.querySelectorAll('.booking-step');
const nextToStep2 = document.getElementById('nextToStep2');
const nextToStep3 = document.getElementById('nextToStep3');
const nextToStep4 = document.getElementById('nextToStep4');
const backToStep1 = document.getElementById('backToStep1');
const backToStep2 = document.getElementById('backToStep2');
const backToStep3 = document.getElementById('backToStep3');
const confirmBooking = document.getElementById('confirmBooking');

const serviceOptions = document.querySelectorAll('.service-option');
const departmentSelect = document.getElementById('departmentSelect');
const doctorSelect = document.getElementById('doctorSelect');
const doctorsList = document.getElementById('doctorsList');

// Confirmation Fields
const confirmService = document.getElementById('confirmService');
const confirmDoctor = document.getElementById('confirmDoctor');
const confirmDate = document.getElementById('confirmDate');
const confirmTime = document.getElementById('confirmTime');
const confirmPrice = document.getElementById('confirmPrice');

// =============================

// =============================
// FILTER FUNCTIONALITY
// =============================
filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const category = tab.dataset.category;
        let visibleCount = 0;

        document.querySelectorAll('.service-card').forEach(card => {
            if (category === 'all' || card.dataset.category === category) {
                card.style.display = '';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        noResults.style.display = visibleCount === 0 ? 'block' : 'none';
    });
});

// =============================
// BOOKING WIZARD FUNCTIONALITY
// =============================
let selectedService = null;
let selectedDoctor = null;
let selectedDate = null;
let selectedTime = null;
let selectedPrice = null;

// Step 1: Choose Service
serviceOptions.forEach(option => {
    option.addEventListener('click', () => {
        serviceOptions.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
        selectedService = option.dataset.service;
        selectedPrice = option.querySelector('.price')?.textContent || '-';
        nextToStep2.disabled = false;
    });
});

nextToStep2.addEventListener('click', () => {
    steps[0].classList.remove('active');
    steps[1].classList.add('active');
});

backToStep1.addEventListener('click', () => {
    steps[1].classList.remove('active');
    steps[0].classList.add('active');
});

// Step 2: Choose Department & Doctor
const doctorsData = {
    cardiology: ['د. أحمد', 'د. سارة'],
    neurology: ['د. كريم', 'د. هالة'],
    pediatrics: ['د. نور', 'د. محمود'],
    ophthalmology: ['د. ليلى'],
    dentistry: ['د. عماد'],
    physiotherapy: ['د. مينا'],
    general: ['د. مازن', 'د. رانيا']
};

departmentSelect.addEventListener('change', () => {
    const dept = departmentSelect.value;
    doctorSelect.innerHTML = '<option value="">اختر الطبيب</option>';
    if (doctorsData[dept]) {
        doctorsData[dept].forEach(doc => {
            const opt = document.createElement('option');
            opt.value = doc;
            opt.textContent = doc;
            doctorSelect.appendChild(opt);
        });
        doctorSelect.disabled = false;
    } else {
        doctorSelect.disabled = true;
        nextToStep3.disabled = true;
    }
});

doctorSelect.addEventListener('change', () => {
    selectedDoctor = doctorSelect.value;
    nextToStep3.disabled = !selectedDoctor;
});

nextToStep3.addEventListener('click', () => {
    steps[1].classList.remove('active');
    steps[2].classList.add('active');
});

backToStep2.addEventListener('click', () => {
    steps[2].classList.remove('active');
    steps[1].classList.add('active');
});

// Step 3: Date & Time (simplified for demo)
const calendar = document.getElementById('calendar');
const timeSlots = document.getElementById('timeSlots');

// Demo Dates & Times
const demoDates = ['2026-02-10', '2026-02-11', '2026-02-12'];
const demoTimes = ['09:00', '10:00', '11:00', '12:00'];

demoDates.forEach(date => {
    const btn = document.createElement('button');
    btn.textContent = date;
    btn.classList.add('date-btn');
    btn.addEventListener('click', () => {
        selectedDate = date;
        document.querySelectorAll('.date-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        nextToStep4.disabled = !selectedTime;
    });
    calendar.appendChild(btn);
});

demoTimes.forEach(time => {
    const btn = document.createElement('button');
    btn.textContent = time;
    btn.classList.add('time-btn');
    btn.addEventListener('click', () => {
        selectedTime = time;
        document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        nextToStep4.disabled = !selectedDate;
    });
    timeSlots.appendChild(btn);
});

nextToStep4.addEventListener('click', () => {
    steps[2].classList.remove('active');
    steps[3].classList.add('active');
    confirmService.textContent = selectedService || '-';
    confirmDoctor.textContent = selectedDoctor || '-';
    confirmDate.textContent = selectedDate || '-';
    confirmTime.textContent = selectedTime || '-';
    confirmPrice.textContent = selectedPrice || '-';
    confirmBooking.disabled = false;
});

backToStep3.addEventListener('click', () => {
    steps[3].classList.remove('active');
    steps[2].classList.add('active');
});

// Confirm Booking
confirmBooking.addEventListener('click', () => {
    const patientName = document.getElementById('patientName').value;
    const patientPhone = document.getElementById('patientPhone').value;
    const patientEmail = document.getElementById('patientEmail').value;

    if (!patientName || !patientPhone || !patientEmail) {
        alert('يرجى تعبئة جميع الحقول الإلزامية');
        return;
    }

    alert(`تم تأكيد الحجز!\n\nالخدمة: ${selectedService}\nالطبيب: ${selectedDoctor}\nالتاريخ: ${selectedDate}\nالوقت: ${selectedTime}\nالمبلغ: ${selectedPrice}`);
    window.print();
});


document.addEventListener("DOMContentLoaded", () => {
    const faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach(item => {
        const question = item.querySelector(".faq-question");

        question.addEventListener("click", () => {
            // إذا الإجابة مفتوحة بالفعل، نقفلها
            if (item.classList.contains("active")) {
                item.classList.remove("active");
            } else {
                // قفل كل الإجابات في نفس القسم
                const category = item.closest(".faq-category");
                const allItems = category.querySelectorAll(".faq-item");
                allItems.forEach(i => i.classList.remove("active"));

                // فتح الإجابة الحالية
                item.classList.add("active");
            }
        });
    });
});
