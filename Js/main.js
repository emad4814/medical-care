// بيانات التطبيق
const appData = {
    departments: [],
    clinics: [],
    appointments: [],
    user: null,
    stats: {
        clinicsCount: 50,
        doctorsCount: 200,
        patientsCount: 10000,
        appointmentsCount: 1245
    }
};

// تهيئة التطبيق
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    setupEventListeners();
    loadDepartments();
    initializeStatsCounter();
});

// تحميل البيانات
function loadData() {
    appData.departments = [
        {id:1,name:'طب القلب',description:'رعاية أمراض القلب والشرايين',icon:'heartbeat',numberOfDoctors:15,isActive:true},
        {id:2,name:'طب الأعصاب',description:'تشخيص وعلاج اضطرابات الجهاز العصبي',icon:'brain',numberOfDoctors:12,isActive:true},
        {id:3,name:'طب الأطفال',description:'رعاية صحية شاملة للأطفال',icon:'baby',numberOfDoctors:20,isActive:true},
        {id:4,name:'طب العيون',description:'تشخيص وعلاج أمراض العيون',icon:'eye',numberOfDoctors:8,isActive:true},
        {id:5,name:'طب الأسنان',description:'رعاية وتجميل الأسنان',icon:'tooth',numberOfDoctors:18,isActive:true},
        {id:6,name:'الطب الطبيعي',description:'إعادة التأهيل والعلاج الطبيعي',icon:'wheelchair',numberOfDoctors:10,isActive:true}
    ];

    const storedUser = localStorage.getItem('medicalPlatformUser');
    if (storedUser) {
        appData.user = JSON.parse(storedUser);
        updateUserUI();
    }
}

// إعداد مستمعي الأحداث
function setupEventListeners() {
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    if(menuToggle && navLinks){
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.innerHTML = navLinks.classList.contains('active') ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        });
    }

    document.addEventListener('click', e => {
        if(navLinks && menuToggle && !navLinks.contains(e.target) && !menuToggle.contains(e.target)){
            navLinks.classList.remove('active');
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });

    const loginModal = document.getElementById('loginModal');
    const closeModal = document.getElementById('closeModal');
    const loginForm = document.getElementById('loginForm');

    if(loginModal && closeModal){
        document.querySelectorAll('.btn-login, .btn-secondary[href*="login"]').forEach(btn => {
            btn.addEventListener('click', e=>{
                if(btn.getAttribute('href') === 'login.html') return;
                e.preventDefault();
                loginModal.classList.add('active');
                document.body.style.overflow='hidden';
            });
        });

        closeModal.addEventListener('click', ()=>{
            loginModal.classList.remove('active');
            document.body.style.overflow='auto';
        });

        loginModal.addEventListener('click', e=>{
            if(e.target===loginModal){
                loginModal.classList.remove('active');
                document.body.style.overflow='auto';
            }
        });

        if(loginForm){
            loginForm.addEventListener('submit', e=>{
                e.preventDefault();
                handleLogin();
            });
        }
    }

    updateLoginLink();
}

// تحديث رابط تسجيل الدخول
function updateLoginLink(){
    document.querySelectorAll('.btn-login, a[href="login.html"]').forEach(link=>{
        if(appData.user){
            link.innerHTML='<i class="fas fa-user"></i> حسابي';
            link.href='dashboard.html';
            link.classList.remove('btn-login');
            link.classList.add('btn-secondary');
        }else{
            link.innerHTML='<i class="fas fa-sign-in-alt"></i> تسجيل الدخول';
            link.href='login.html';
            link.classList.add('btn-login');
            link.classList.remove('btn-secondary');
        }
    });
}

// تحديث واجهة المستخدم
function updateUserUI(){
    const userGreeting = document.getElementById('userGreeting');
    if(userGreeting && appData.user){
        userGreeting.textContent = `مرحباً، ${appData.user.fullName}`;
        userGreeting.style.display='inline-block';
    }
    updateLoginLink();
}

// تسجيل الدخول
function handleLogin(){
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const loginModal = document.getElementById('loginModal');

    if(username==='admin' && password==='admin123'){
        const user = {id:1,username:'admin',email:'admin@medical.com',fullName:'مدير النظام',role:'admin'};
        appData.user = user;
        localStorage.setItem('medicalPlatformUser',JSON.stringify(user));
        loginModal.classList.remove('active');
        document.body.style.overflow='auto';
        updateUserUI();
        showNotification('تم تسجيل الدخول بنجاح!','success');
        setTimeout(()=>{window.location.href='dashboard.html';},1500);
    }else{
        showNotification('اسم المستخدم أو كلمة المرور غير صحيحة','error');
    }
}

// إشعارات
function showNotification(message,type='info'){
    const existing = document.querySelector('.notification');
    if(existing) existing.remove();

    const notification = document.createElement('div');
    notification.className=`notification ${type}`;
    notification.innerHTML=`<span>${message}</span><button class="close-notification">&times;</button>`;
    document.body.appendChild(notification);

    setTimeout(()=>{notification.classList.add('show');},10);

    notification.querySelector('.close-notification').addEventListener('click',()=>{
        notification.classList.remove('show');
        setTimeout(()=>{notification.remove();},300);
    });

    setTimeout(()=>{
        if(notification.parentNode){
            notification.classList.remove('show');
            setTimeout(()=>{notification.remove();},300);
        }
    },5000);
}

// عداد الإحصائيات
function initializeStatsCounter(){
    const counters = document.querySelectorAll('.stat-item h3');
    const speed = 200;

    counters.forEach(counter=>{
        let targetValue=0;
        const statText = counter.parentElement.querySelector('p').textContent;
        if(statText.includes('عيادة')) targetValue=appData.stats.clinicsCount;
        else if(statText.includes('طبيب')) targetValue=appData.stats.doctorsCount;
        else if(statText.includes('مريض')) targetValue=appData.stats.patientsCount;
        else if(statText.includes('حجز')) targetValue=appData.stats.appointmentsCount;

        counter.setAttribute('data-target',targetValue);
        counter.innerText='0';

        const updateCount=()=>{
            const target=parseInt(counter.getAttribute('data-target'));
            let count=parseInt(counter.innerText.replace(/,/g,''));
            const increment=Math.ceil(target/speed);
            if(count<target){
                count+=increment;
                if(count>target) count=target;
                counter.innerText=count.toLocaleString();
                requestAnimationFrame(updateCount);
            }else{
                counter.innerText=target.toLocaleString();
            }
        };

        const observer = new IntersectionObserver(entries=>{
            entries.forEach(entry=>{
                if(entry.isIntersecting){
                    updateCount();
                    observer.unobserve(entry.target);
                }
            });
        },{threshold:0.5});

        observer.observe(counter);
    });
}

// تحميل الأقسام
function loadDepartments(){
    const grid=document.getElementById('departmentsGrid');
    if(!grid) return;
    grid.innerHTML='';
    appData.departments.forEach(d=>{
        const card=document.createElement('div');
        card.className='department-card';
        card.innerHTML=`
            <div class="department-header">
                <div class="department-icon"><i class="fas fa-${d.icon}"></i></div>
                <h3>${d.name}</h3>
                <p>${d.description}</p>
            </div>
            <div class="department-body">
                <div class="department-info">
                    <span class="doctors-count">${d.numberOfDoctors} طبيب</span>
                    <span class="status-badge ${d.isActive?'active':'inactive'}">${d.isActive?'نشط':'غير نشط'}</span>
                </div>
                <div class="department-action">
                    <a href="services.html?department=${d.id}" class="btn btn-primary">
                        <i class="fas fa-calendar-alt"></i> احجز موعد
                    </a>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// تسجيل الخروج
function logout(){
    localStorage.removeItem('medicalPlatformUser');
    appData.user=null;
    updateUserUI();
    showNotification('تم تسجيل الخروج بنجاح','info');
    setTimeout(()=>{window.location.href='index.html';},1500);
}
