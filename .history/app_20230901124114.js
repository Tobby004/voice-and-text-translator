let mediaRecorder;
let audioChunks = [];
let audioBlob;
let audioUrl;
let audio = new Audio();
let recordingInterval;

document.getElementById("startRecord").addEventListener("click", startRecording);
document.getElementById("stopRecord").addEventListener("click", stopRecording);
document.getElementById("playAudio").addEventListener("click", playLastRecording);
document.getElementById("translate").addEventListener("click", translateRecording);

async function startRecording() {
    audioChunks = [];
    audioBlob = null;
    audioUrl = null;

    let stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = event => {
        audioChunks.push(event.data);
    };
    mediaRecorder.onstop = () => {
        audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        audioUrl = URL.createObjectURL(audioBlob);
        audio.src = audioUrl;
        
        const audioPlayer = document.getElementById("audioPlayer");
        audioPlayer.src = audioUrl;
        audioPlayer.style.display = "block";
    };
    mediaRecorder.start();

    // UI updates for recording
    document.getElementById("startRecord").disabled = true;
    document.getElementById("stopRecord").disabled = false;

    let recordingDuration = 0;
    document.getElementById("recordingStatus").textContent = "Recording: 00:00";
    recordingInterval = setInterval(() => {
        recordingDuration += 1;
        let minutes = Math.floor(recordingDuration / 60);
        let seconds = recordingDuration % 60;
        document.getElementById("recordingStatus").textContent = `Recording: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }, 1000);
}

function stopRecording() {
    if (mediaRecorder) {
        mediaRecorder.stop();
    }

    // UI updates after recording
    document.getElementById("startRecord").disabled = false;
    document.getElementById("stopRecord").disabled = true;
    clearInterval(recordingInterval);
    document.getElementById("recordingStatus").textContent = "Recording Stopped";
}

function playLastRecording() {
    if (audioUrl) {
        audio.play();
    } else {
        alert("No recording available. Please record something first.");
    }
}

async function translateRecording() {
    if (!audioBlob) {
        alert("Please record something first!");
        return;
    }

    // Placeholder for sending the audioBlob to a voice-to-text service
    let transcribedText = "This is a placeholder for the transcribed text."; 

    const sourceLang = 'en';
    const languageSelect = document.getElementById("languageSelect");
    const targetLang = languageSelect.value;
    
    const translatedContainer = document.getElementById("translatedTextContainer");
    translatedContainer.innerHTML = "";  // Clear previous translations

    let translated = await translateText(transcribedText, sourceLang, targetLang);
    let translatedDiv = document.createElement("div");
    translatedDiv.textContent = `Translation (${targetLang}): ${translated}`;
    translatedContainer.appendChild(translatedDiv);
}

// Populate the language dropdown on page load
populateLanguageDropdown();
