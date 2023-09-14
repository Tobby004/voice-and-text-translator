const MYMEMORY_ENDPOINT = "https://api.mymemory.translated.net/get";
const MYMEMORY_EMAIL = "your_email_here";  // Replace with your email

async function translateWithMyMemory(sourceLang, targetLang, text) {
    const response = await fetch(`${MYMEMORY_ENDPOINT}?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}&de=${MYMEMORY_EMAIL}`);

    if (!response.ok) {
        throw new Error("Failed to translate using MyMemory");
    }

    const data = await response.json();
    return data.responseData.translatedText;
}

// This function populates the language dropdown with supported languages
async function populateLanguageDropdown() {
    // Languages supported by MyMemory (Note: This is a subset, there are many more supported languages)
    const supportedLanguages = [
        { code: "de", name: "German" },
        { code: "en", name: "English" },
        { code: "fr", name: "French" },
        { code: "es", name: "Spanish" },
        { code: "pt", name: "Portuguese" },
        { code: "it", name: "Italian" },
        { code: "nl", name: "Dutch" },
        { code: "pl", name: "Polish" },
        { code: "ru", name: "Russian" },
        { code: "ja", name: "Japanese" },
        { code: "zh-CN", name: "Chinese Simplified" }
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
