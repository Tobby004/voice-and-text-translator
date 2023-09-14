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
document.getElementById("textTranslate").addEventListener("click", translateTextContent);

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
    };

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
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
        mediaRecorder.stop();
        document.getElementById("startRecord").disabled = false;
        document.getElementById("stopRecord").disabled = true;

        clearInterval(recordingInterval);
        document.getElementById("recordingStatus").textContent = "Recording Stopped";
    }
}

function playLastRecording() {
    if (audioUrl) {
        audio.play();
    } else {
        alert("No recording available to play.");
    }
}

async function translateRecording() {
    if (!audioBlob) {
        alert("Please record something first!");
        return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'en-US';

    recognition.onresult = async function(event) {
        const transcribedText = event.results[0][0].transcript;

        const sourceLang = 'en';
        const targetLang = document.getElementById("languageSelect").value;

        if (sourceLang !== targetLang) {
            let translated = await translateText(sourceLang, targetLang, transcribedText);
            document.getElementById("translatedTextContainer").textContent = translated;
        } else {
            document.getElementById("translatedTextContainer").textContent = "Please select a different language for translation.";
        }
    };

    recognition.onerror = function(event) {
        alert('Error occurred in recognition: ' + event.error);
    }

    recognition.start();
}

async function translateTextContent() {
    const sourceText = document.getElementById("textToTranslate").value;
    const sourceLang = 'en';
    const targetLang = document.getElementById("languageSelect").value;

    if (sourceText) {
        if (sourceLang !== targetLang) {
            let translated = await translateText(sourceLang, targetLang, sourceText);
            document.getElementById("translatedTextContainer").textContent = translated;
        } else {
            document.getElementById("translatedTextContainer").textContent = "Please select a different language for translation.";
        }
    } else {
        alert("Please enter text to translate.");
    }
}

async function translateText(sourceLang, targetLang, text) {
    // Placeholder: Integrate with your translation API here
    return `Translated [${sourceLang} to ${targetLang}]: ${text}`;
}
