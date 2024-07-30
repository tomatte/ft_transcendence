document.addEventListener('DOMContentLoaded', function() {
    const LANGUAGES = ['en', 'it', 'pt']; // Supported languages
    const DEFAULT_LANGUAGE = 'en'; // Default language

    const elements = {
        languageSelector: document.querySelectorAll('input[name="language"]'),
        banners: document.querySelectorAll('.game-mode-banner'),
    };

    // Function to fetch JSON data from a specific language file
    async function fetchLanguageData(language) {
        try {
            const response = await fetch(`./translations/${language}.json`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json();
        } catch (error) {
            console.error(`Error fetching ${language} language data:`, error);
            return null; // Ensure to return something in case of error
        }
    }

    // Function to update text content based on language
    async function updateLanguage(language) {
        const data = await fetchLanguageData(language);
        if (data) {
            elements.banners.forEach(banner => {
                const bannerClass = banner.classList[1].replace('game-mode-banner--', '');
                updateBannerContent(banner, data, language, bannerClass);
            });
        }
    }

    // Function to update content of a specific banner based on language
    function updateBannerContent(banner, data, language, bannerClass) {
        const titleElement = banner.querySelector('.game-mode-banner__info__title');
        const buttonElement = banner.querySelector('.button__text');

        if (titleElement && buttonElement) {
            const titleKey = titleElement.getAttribute('data-lang-key');
            const buttonKey = buttonElement.getAttribute('data-lang-key');

            if (data[language][titleKey]) {
                titleElement.textContent = data[language][titleKey];
            }

            if (data[language][buttonKey]) {
                buttonElement.textContent = data[language][buttonKey];
            }
        }
    }

    // Initial setup: Update banners with default language
    updateLanguage(DEFAULT_LANGUAGE);

    // Event listener for language selector radio buttons
    elements.languageSelector.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.checked && LANGUAGES.includes(this.value)) {
                updateLanguage(this.value);
            }
        });
    });
});
