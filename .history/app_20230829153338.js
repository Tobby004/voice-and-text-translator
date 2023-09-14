let mediaRecorder;
let recordedChunks = [];

document.getElementById('startRecord').onclick = function() {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.ondataavailable = function(event) {
                if (event.data.size > 0) {
                    recordedChunks.push(event.data);
                }
            };
            
            mediaRecorder.onstop = function() {
                let blob = new Blob(recordedChunks, { type: 'audio/wav' });
                let url = URL.createObjectURL(blob);
                let li = document.createElement('li');
                let audio = new Audio(url);
                audio.controls = true;
                li.appendChild(audio);
                li.dataset.blob = blob; // Store the blob in a dataset for later use
                document.getElementById('recordingsList').appendChild(li);
                document.getElementById('playAudio').disabled = false;
                recordedChunks = [];
            };

            mediaRecorder.start();
            document.getElementById('startRecord').disabled = true;
            document.getElementById('stopRecord').disabled = false;
        })
        .catch(error => {
            console.error("Error accessing the microphone:", error);
        });
};

document.getElementById('stopRecord').onclick = function() {
    mediaRecorder.stop();
    document.getElementById('startRecord').disabled = false;
    document.getElementById('stopRecord').disabled = true;
};

document.getElementById('playAudio').onclick = function() {
    let lastRecording = document.getElementById('recordingsList').lastChild.firstChild;
    if (lastRecording && lastRecording.play) {
        lastRecording.play();
    }
};

document.getElementById('translate').onclick = function() {
    // Retrieve the last recorded audio blob
    let lastRecordingBlob = document.getElementById('recordingsList').lastChild.dataset.blob;
    let targetLanguage = document.getElementById('languageSelect').value;

    convertAudioToText(lastRecordingBlob)
        .then(text => translateText(text, targetLanguage))
        .then(translatedText => {
            document.getElementById('translatedText').innerText = translatedText;
        })
        .catch(error => {
            console.error("Error during translation:", error);
        });
};

function convertAudioToText(audioBlob) {
    let formData = new FormData();
    formData.append('audio', audioBlob);

    // Use your backend endpoint for Speech-to-Text conversion
    return fetch('/api/convertAudioToText', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => data.text);
}

function translateText(text, targetLanguage) {
    // Use your backend endpoint for translation
    return fetch('/api/translateText', {
        method: 'POST',
        body: JSON.stringify({ text: text, targetLanguage: targetLanguage }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => data.translatedText);
}

// Fetch available languages dynamically from your backend
fetchAvailableLanguages()
    .then(languages => {
        let select = document.getElementById('languageSelect');
        languages.forEach(lang => {
            let option = document.createElement('option');
            option.value = lang.code;
            option.innerText = lang.name;
            select.appendChild(option);
        });
    })
    .catch(error => {
        console.error("Error fetching languages:", error);
    });

function fetchAvailableLanguages() {
    // Use your backend endpoint for fetching available languages
    return fetch('/api/availableLanguages')
    .then(response => response.json())
    .then(data => data.languages);
}
