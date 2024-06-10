document.addEventListener('DOMContentLoaded', async () => {
    const recordingIndicator = document.getElementById('recording-indicator');
    const startRecordingButton = document.getElementById('start-record-button');
    const stopRecordingButton = document.getElementById('stop-record-button');
    let mediaRecorder;
    let recordedChunks = [];

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = event => {
            if (event.data.size > 0) {
                recordedChunks.push(event.data);
            }
        };

        mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(recordedChunks, {type: 'audio/webm'});
            const formData = new FormData();
            formData.append('audio', audioBlob);

            try {
                const response = await fetch('/process-audio', {
                    method: 'POST',
                    body: formData
                });
                if (response.ok) {
                    console.log('Audio processed successfully');

                    const returnedBlob = await response.blob();
                    const returnedUrl = URL.createObjectURL(returnedBlob);
                    new Audio(returnedUrl).play();

                } else {
                    console.error('Server error:', response.statusText);
                }
            } catch (error) {
                console.error('Upload failed:', error);
            }
        };
    } catch (error) {
        console.error('Failed to get media:', error);
    }

    startRecordingButton.addEventListener('click', () => {
        startRecordingButton.style.display = 'none';
        stopRecordingButton.style.display = 'block';
        if (mediaRecorder.state === 'inactive') {
            mediaRecorder.start();
            recordingIndicator.style.visibility = 'visible';
            recordedChunks = [];
        }
    });

    stopRecordingButton.addEventListener('click', () => {
        stopRecordingButton.style.display = 'none';
        startRecordingButton.style.display = 'block';
        if (mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
            recordingIndicator.style.visibility = 'hidden';
        }
    });
});