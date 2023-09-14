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
    audioChunks = [];
    mediaRecorder.start();
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
    mediaRecorder.stop();
    document.getElementById("startRecord").disabled = false;
    document.getElementById("stopRecord").disabled = true;
    document.getElementById("playAudio").disabled = false;

    clearInterval(recordingInterval);
    document.getElementById("recordingStatus").textContent = "Recording Stopped";
}

function playLastRecording() {
    const audioPlayer = document.getElementById("audioPlayer");
    audioPlayer.currentTime = 0;
    audioPlayer.play();
}

function translateRecording() {
    if(!audioBlob) {
        alert("Please record something first!");
        return;
    }
    // Placeholder for sending the audioBlob to a voice-to-text service
    let transcribedText = "This is a placeholder for the transcribed text.";
    
    // Placeholder for sending the transcribedText to a translation API
    let translatedText = "This is a placeholder for the translated text.";
    
    document.getElementById("translatedText").innerText = translatedText;
}

// Placeholder for fetching the list of languages from an API
let languages = ["English", "Spanish", "French"]; // example languages
let languageSelect = document.getElementById("languageSelect");
languages.forEach(lang => {
    let option = document.createElement("option");
    option.value = lang;
    option.innerText = lang;
    languageSelect.appendChild(option);
});
