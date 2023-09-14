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
                document.getElementById('recordingsList').appendChild(li);
                document.getElementById('playAudio').disabled = false;
                recordedChunks = [];
            };

            mediaRecorder.start();
            document.getElementById('startRecord').disabled = true;
            document.getElementById('stopRecord').disabled = false;
        });
};

document.getElementById('stopRecord').onclick = function() {
    mediaRecorder.stop();
    document.getElementById('startRecord').disabled = false;
    document.getElementById('stopRecord').disabled = true;
};

document.getElementById('playAudio').onclick = function() {
    let lastRecording = document.getElementById('recordingsList').lastChild.firstChild;
    lastRecording.play();
};
