const LOCAL_PROXY_ENDPOINT = "http://localhost:8080/translate";
const DEEPL_API_KEY = "7cfd8245-09e3-820a-a29e-fc9bdb1e7c8a:fx";  // Replace with your actual DeepL API key

async function translateWithDeepL(sourceLang, targetLang, text) {
    const requestData = {
        auth_key: DEEPL_API_KEY,
        source_lang: sourceLang,
        target_lang: targetLang,
        text: text
    };

    const response = await fetch(LOCAL_PROXY_ENDPOINT, {
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
    // Languages supported by DeepL
    const supportedLanguages = [
        { code: "DE", name: "German" },
        { code: "EN", name: "English" },
        { code: "FR", name: "French" },
        { code: "ES", name: "Spanish" },
        { code: "PT", name: "Portuguese" },
        { code: "IT", name: "Italian" },
        { code: "NL", name: "Dutch" },
        { code: "PL", name: "Polish" },
        { code: "RU", name: "Russian" },
        { code: "JA", name: "Japanese" },
        { code: "ZH", name: "Chinese" }
    ];
    const languageSelect = document.getElementById("languageSelect");
    for (let lang of supportedLanguages) {
        let option = document.createElement("option");
        option.value = lang.code;
        option.textContent = lang.name;
        languageSelect.appendChild(option);
    }
}

// Call the function to populate the dropdown on page load
document.addEventListener('DOMContentLoaded', populateLanguageDropdown);
