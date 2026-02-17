let translations = {};
let currentLang = localStorage.getItem("lang") || "ar";

fetch("translations.json")
    .then(res => res.json())
    .then(data => {
        translations = data;
        applyLanguage(currentLang);
        translatePage();
        loadUpcomingAppointments();
    });

function setLanguage(lang) {
    localStorage.setItem("lang", lang);
    applyLanguage(lang);
}

function changeLanguage(lang) {
    currentLang = lang;
    localStorage.setItem("lang", lang);

    translatePage();
    loadUpcomingAppointments();
    updateLangLabel(lang);

}

function t(key, fallback = '') {
    if (translations[currentLang] && translations[currentLang][key]) {
        return translations[currentLang][key];
    }
    return fallback || key;
}



function applyLanguage(lang) {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

    // النصوص العادية
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (translations[lang] && translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });

    // placeholders (input / textarea)
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
        const key = el.getAttribute("data-i18n-placeholder");
        if (translations[lang] && translations[lang][key]) {
            el.placeholder = translations[lang][key];
        }
    });
}

const langDropdown = document.querySelector(".lang-dropdown");
const currentLangSpan = document.getElementById("current-lang");

if (langDropdown) {
    const btn = langDropdown.querySelector(".lang-btn");

    btn.addEventListener("click", (e) => {
        e.stopPropagation();
        langDropdown.classList.toggle("active");
    });

    document.addEventListener("click", () => {
        langDropdown.classList.remove("active");
    });
}

function updateLangLabel(lang) {
    const labels = {
        ar: "AR",
        en: "EN",
        fr: "FR"
    };

    if (currentLangSpan) {
        currentLangSpan.textContent = labels[lang] || lang.toUpperCase();
    }
}

/* wrap original setLanguage */
const _setLanguage = window.setLanguage;

window.setLanguage = function (lang) {
    _setLanguage(lang);
    updateLangLabel(lang);
    if (langDropdown) langDropdown.classList.remove("active");
};
