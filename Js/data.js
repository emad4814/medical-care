// ملف بيانات التطبيق
const departmentsData = [
    {
        id: 1,
        name: 'طب القلب',
        description: 'رعاية أمراض القلب والشرايين',
        icon: 'heartbeat',
        numberOfDoctors: 15,
        isActive: true,
        services: ['تخطيط القلب', 'قسطرة القلب', 'فحص الجهد', 'مراقبة ضغط الدم']
    },
    {
        id: 2,
        name: 'طب الأعصاب',
        description: 'تشخيص وعلاج اضطرابات الجهاز العصبي',
        icon: 'brain',
        numberOfDoctors: 12,
        isActive: true,
        services: ['رسم المخ', 'الأشعة المقطعية', 'الرنين المغناطيسي', 'علاج الصداع']
    },
    {
        id: 3,
        name: 'طب الأطفال',
        description: 'رعاية صحية شاملة للأطفال',
        icon: 'baby',
        numberOfDoctors: 20,
        isActive: true,
        services: ['فحص النمو', 'تطعيمات الأطفال', 'علاج أمراض الطفولة', 'استشارات تغذية']
    },
    {
        id: 4,
        name: 'طب العيون',
        description: 'تشخيص وعلاج أمراض العيون',
        icon: 'eye',
        numberOfDoctors: 8,
        isActive: true,
        services: ['فحص النظر', 'تصحيح الإبصار', 'جراحة العيون', 'علاج الجلوكوما']
    },
    {
        id: 5,
        name: 'طب الأسنان',
        description: 'رعاية وتجميل الأسنان',
        icon: 'tooth',
        numberOfDoctors: 18,
        isActive: true,
        services: ['تنظيف الأسنان', 'علاج العصب', 'تركيبات الأسنان', 'تقويم الأسنان']
    },
    {
        id: 6,
        name: 'الطب الطبيعي',
        description: 'إعادة التأهيل والعلاج الطبيعي',
        icon: 'wheelchair',
        numberOfDoctors: 10,
        isActive: true,
        services: ['علاج آلام الظهر', 'إعادة تأهيل الرياضيين', 'علاج الشلل', 'العلاج المائي']
    }
];

const clinicsData = [
    {
        id: 1,
        name: 'العيادة المركزية',
        address: 'شارع الملك فهد، الرياض',
        city: 'الرياض',
        phone: '0112345678',
        lat: 24.7136,
        lng: 46.6753,
        workingHours: '8 صباحاً - 10 مساءً',
        departments: [1, 2, 3, 4, 5, 6]
    },
    {
        id: 2,
        name: 'فرع الشمال',
        address: 'حي الملك عبدالله، الرياض',
        city: 'الرياض',
        phone: '0118765432',
        lat: 24.8393,
        lng: 46.7385,
        workingHours: '9 صباحاً - 9 مساءً',
        departments: [1, 3, 5]
    },
    {
        id: 3,
        name: 'فرع الغربية',
        address: 'شارع التحلية، جدة',
        city: 'جدة',
        phone: '0123456789',
        lat: 21.4858,
        lng: 39.1925,
        workingHours: '10 صباحاً - 11 مساءً',
        departments: [2, 4, 6]
    },
    {
        id: 4,
        name: 'فرع الشرقية',
        address: 'حي الربيع، الخبر',
        city: 'الخبر',
        phone: '0139876543',
        lat: 26.2172,
        lng: 50.1971,
        workingHours: '8 صباحاً - 10 مساءً',
        departments: [1, 2, 3, 4]
    }
];

const servicesData = [
    {
        id: 1,
        name: 'استشارة أولية',
        description: 'فحص طبي شامل وتشخيص أولي',
        price: 150,
        duration: 30,
        category: 'consultation',
        departmentId: null
    },
    {
        id: 2,
        name: 'فحص القلب',
        description: 'فحص القلب والأوعية الدموية الشامل',
        price: 300,
        duration: 45,
        category: 'examination',
        departmentId: 1
    },
    {
        id: 3,
        name: 'تخطيط القلب',
        description: 'فحص كهربائية القلب',
        price: 200,
        duration: 30,
        category: 'examination',
        departmentId: 1
    },
    {
        id: 4,
        name: 'فحص العيون',
        description: 'فحص النظر وتشخيص أمراض العيون',
        price: 200,
        duration: 40,
        category: 'examination',
        departmentId: 4
    },
    {
        id: 5,
        name: 'علاج طبيعي',
        description: 'جلسات علاج طبيعي وإعادة تأهيل',
        price: 250,
        duration: 60,
        category: 'treatment',
        departmentId: 6
    },
    {
        id: 6,
        name: 'تحليل دم',
        description: 'فحص الدم الشامل والمتخصص',
        price: 180,
        duration: 15,
        category: 'lab',
        departmentId: null
    }
];

const appointmentsData = [
    {
        id: 1,
        patientName: 'محمد أحمد',
        patientId: 101,
        doctorName: 'د. علي حسن',
        department: 'طب القلب',
        date: '2024-01-15',
        time: '10:00 ص',
        status: 'confirmed',
        serviceId: 2
    },
    {
        id: 2,
        patientName: 'سارة خالد',
        patientId: 102,
        doctorName: 'د. نادية محمد',
        department: 'طب الأطفال',
        date: '2024-01-16',
        time: '02:00 م',
        status: 'pending',
        serviceId: 1
    },
    {
        id: 3,
        patientName: 'عمر سليم',
        patientId: 103,
        doctorName: 'د. خالد محمود',
        department: 'طب الأعصاب',
        date: '2024-01-17',
        time: '11:30 ص',
        status: 'completed',
        serviceId: 1
    }
];

// دوال مساعدة للبيانات
function getDepartmentById(id) {
    return departmentsData.find(dept => dept.id === id);
}

function getClinicsByDepartment(departmentId) {
    return clinicsData.filter(clinic => clinic.departments.includes(departmentId));
}

function getServicesByDepartment(departmentId) {
    return servicesData.filter(service => service.departmentId === departmentId);
}

function getAppointmentsByUser(userId) {
    return appointmentsData.filter(appointment => appointment.patientId === userId);
}

function getServiceById(serviceId) {
    return servicesData.find(service => service.id === serviceId);
}

function getClinicById(clinicId) {
    return clinicsData.find(clinic => clinic.id === clinicId);
}

// دالة للبحث في البيانات
function searchData(query, type = 'all') {
    const normalizedQuery = query.toLowerCase();

    if (type === 'departments' || type === 'all') {
        const departmentsResults = departmentsData.filter(dept =>
            dept.name.toLowerCase().includes(normalizedQuery) ||
            dept.description.toLowerCase().includes(normalizedQuery)
        );

        if (type === 'departments') return departmentsResults;
    }

    if (type === 'services' || type === 'all') {
        const servicesResults = servicesData.filter(service =>
            service.name.toLowerCase().includes(normalizedQuery) ||
            service.description.toLowerCase().includes(normalizedQuery)
        );

        if (type === 'services') return servicesResults;
    }

    if (type === 'clinics' || type === 'all') {
        const clinicsResults = clinicsData.filter(clinic =>
            clinic.name.toLowerCase().includes(normalizedQuery) ||
            clinic.address.toLowerCase().includes(normalizedQuery) ||
            clinic.city.toLowerCase().includes(normalizedQuery)
        );

        if (type === 'clinics') return clinicsResults;
    }

    return [];
}

// دالة لحجز موعد جديد
function bookAppointment(appointmentData) {
    const newId = appointmentsData.length > 0
        ? Math.max(...appointmentsData.map(a => a.id)) + 1
        : 1;

    const newAppointment = {
        id: newId,
        ...appointmentData,
        createdAt: new Date().toISOString(),
        status: 'pending'
    };

    appointmentsData.push(newAppointment);
    return newAppointment;
}

// دالة لتحديث حالة الحجز
function updateAppointmentStatus(appointmentId, newStatus) {
    const appointmentIndex = appointmentsData.findIndex(a => a.id === appointmentId);
    if (appointmentIndex !== -1) {
        appointmentsData[appointmentIndex].status = newStatus;
        appointmentsData[appointmentIndex].updatedAt = new Date().toISOString();
        return true;
    }
    return false;
}

// دالة لحذف حجز
function deleteAppointment(appointmentId) {
    const appointmentIndex = appointmentsData.findIndex(a => a.id === appointmentId);
    if (appointmentIndex !== -1) {
        appointmentsData.splice(appointmentIndex, 1);
        return true;
    }
    return false;
}

// تصدير البيانات والدوال
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        departmentsData,
        clinicsData,
        servicesData,
        appointmentsData,
        getDepartmentById,
        getClinicsByDepartment,
        getServicesByDepartment,
        getAppointmentsByUser,
        getServiceById,
        getClinicById,
        searchData,
        bookAppointment,
        updateAppointmentStatus,
        deleteAppointment
    };
}

// بيانات المستخدمين الافتراضية
const defaultUsers = [
    {
        id: 1,
        username: 'admin',
        email: 'admin@medical.com',
        password: 'admin123',
        fullName: 'مدير النظام',
        phone: '0512345678',
        role: 'admin',
        isActive: true,
        createdAt: '2024-01-01',
        medicalInfo: null
    },
    {
        id: 2,
        username: 'doctor',
        email: 'doctor@medical.com',
        password: 'doctor123',
        fullName: 'د. أحمد محمد',
        phone: '0512345679',
        role: 'doctor',
        isActive: true,
        createdAt: '2024-01-01',
        medicalInfo: {
            specialty: 'طب القلب',
            licenseNumber: 'DOC12345',
            yearsOfExperience: 15
        }
    },
    {
        id: 3,
        username: 'patient',
        email: 'patient@medical.com',
        password: 'patient123',
        fullName: 'محمد أحمد',
        phone: '0512345680',
        role: 'patient',
        isActive: true,
        createdAt: '2024-01-01',
        medicalInfo: {
            bloodType: 'A+',
            height: 175,
            weight: 75,
            chronicDiseases: 'لا يوجد',
            allergies: 'لا يوجد',
            insuranceCompany: 'bupa',
            insuranceNumber: 'BUP123456'
        }
    }
];

// تهيئة بيانات المستخدمين عند أول تشغيل
function initializeUsersData() {
    if (!localStorage.getItem('medicalPlatformUsers')) {
        localStorage.setItem('medicalPlatformUsers', JSON.stringify(defaultUsers));
    }
}

// استدعاء تهيئة البيانات عند تحميل الصفحة
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', initializeUsersData);
}