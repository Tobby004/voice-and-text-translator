// translator.js

const API_KEY = 'YOUR_GOOGLE_CLOUD_API_KEY';

// Fetching the list of supported languages
async function fetchSupportedLanguages() {
    const response = await fetch(`https://translation.googleapis.com/language/translate/v2/languages?key=${API_KEY}`);
    const data = await response.json();
    const languages = data.data.languages.map(lang => lang.language);
    populateLanguagesDropdown(languages);  // Function to populate the dropdown with fetched languages
    return languages;
}

// Translating text
async function translateText(sourceLang, targetLang, text) {
    const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${API_KEY}&source=${sourceLang}&target=${targetLang}&q=${text}`);
    const data = await response.json();
    displayTranslatedText(data.data.translations[0].translatedText);  // Function to display the translated text to the user
}

// Function to populate the language dropdown with the list of supported languages
function populateLanguagesDropdown(languages) {
    const dropdown = document.getElementById('languageSelect');
    languages.forEach(lang => {
        const option = document.createElement('option');
        option.value = lang;
        option.innerText = lang;
        dropdown.appendChild(option);
    });
}

// Function to display the translated text to the user
function displayTranslatedText(translatedText) {
    const outputDiv = document.getElementById('translatedText');
    outputDiv.innerText = translatedText;
}

// Initial call to populate the dropdown when the page loads
document.addEventListener('DOMContentLoaded', fetchSupportedLanguages);
