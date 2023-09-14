
const DEEPL_API_ENDPOINT = "https://cors-anywhere.herokuapp.com/https://api-free.deepl.com/v2/translate";
const DEEPL_API_ENDPOINT = "https://api-free.deepl.com/v2/translate";
const DEEPL_API_KEY = "b24af2b0-f0af-b39e-0c85-fb0731487499:fx";  // Replace with your actual DeepL API key

async function translateWithDeepL(sourceLang, targetLang, text) {
    const requestData = {
        auth_key: DEEPL_API_KEY,
        source_lang: sourceLang,
        target_lang: targetLang,
        text: text
    };

    const response = await fetch(DEEPL_API_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    });

    if (!response.ok) {
        throw new Error("Failed to translate using DeepL");
    }

    const data = await response.json();
    return data.translations[0].text;
}

// This function populates the language dropdown with supported languages
async function populateLanguageDropdown() {
    // Placeholder for supported languages by DeepL
    const supportedLanguages = ["DE", "EN", "FR", "ES", "PT", "IT", "NL", "PL", "RU", "JA", "ZH"];
    const languageSelect = document.getElementById("languageSelect");
    for (let lang of supportedLanguages) {
        let option = document.createElement("option");
        option.value = lang;
        option.textContent = lang;  // You can enhance this by mapping language codes to full language names
        languageSelect.appendChild(option);
    }
}

// Call the function to populate the dropdown on page load
document.addEventListener('DOMContentLoaded', populateLanguageDropdown);
