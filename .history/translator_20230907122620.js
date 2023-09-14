const LOCAL_PROXY_ENDPOINT = "http://localhost:8080/translate";

async function translateTextUsingMyMemory(sourceText, sourceLang, targetLang) {
    const endpoint = `${LOCAL_PROXY_ENDPOINT}?q=${sourceText}&langpair=${sourceLang}|${targetLang}`;

    const response = await fetch(endpoint);
    if (!response.ok) {
        throw new Error("Failed to fetch translation");
    }

    const data = await response.json();
    return data.responseData.translatedText;
}

// This function can be extended to handle voice-to-text in the future
async function translateRecordingUsingMyMemory(sourceAudio, sourceLang, targetLang) {
    // Placeholder for sending the audioBlob to a voice-to-text service
    let transcribedText = "This is a placeholder for the transcribed text.";
    
    return await translateTextUsingMyMemory(transcribedText, sourceLang, targetLang);
}
