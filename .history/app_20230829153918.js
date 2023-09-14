let mediaRecorder;
let recordedChunks = [];
let recordedBlobs = []; // New array to store audio blobs

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
                li.dataset.blobIndex = recordedBlobs.length; // Store the index of the blob in the dataset
                recordedBlobs.push(blob); // Store the blob in the global array
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
    let blobIndex = document.getElementById('recordingsList').lastChild.dataset.blobIndex;
    let lastRecordingBlob = recordedBlobs[blobIndex];
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

// ... rest of the code remains unchanged ...
