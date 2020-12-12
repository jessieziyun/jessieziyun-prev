// GET WEBCAM AND MICROPHONE STREAM AND PROCESS AUDIO

let stream;

function isAndroid() {
    return /Android/i.test(navigator.userAgent);
}

function isiOS() {
    return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function isMobile() {
    return isAndroid() || isiOS();
}

async function getStream(audioCtx, analyser) {

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error(
            'Browser API navigator.mediaDevices.getUserMedia not available');
    }

    const video = document.getElementById('video');

    const mobile = isMobile();
    stream = await navigator.mediaDevices.getUserMedia({
        'audio': true,
        'video': {
            facingMode: 'user',
        },
    });

    video.srcObject = stream;
    video.muted = true;

    const audioSource = audioCtx.createMediaStreamSource(stream);
    audioSource.connect(analyser);

    return new Promise((resolve) => {
        video.onloadedmetadata = () => {
            resolve(video);
        };
    });
}

export async function loadStream(audioCtx, analyser) {
    const video = await getStream(audioCtx, analyser);
    video.play();
    return video;
}

// get volume of microphone input
function getVolume(analyser, threshold) {
    if (analyser !== undefined) {
        analyser.fftSize = 32;
        let bufferLength = analyser.frequencyBinCount;
        let dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);
        let rms = 0;
        for (let i = 0; i < bufferLength; i++) {
            let thisAmp = dataArray[i]; // amplitude of current bin
            rms += thisAmp * thisAmp;
        }
        rms /= bufferLength;
        rms = Math.sqrt(rms);
        let sound;
        if (rms > threshold) {
            sound = true;
        } else {
            sound = false;
        }
        return sound;
    }
}

export function getSound(analyser, arr, threshold) {
    let sound = getVolume(analyser, threshold); // detect presence of sound: threshold for sound = true
    let soundStart;
    let soundEnd;

    // store two most recent values in an array
    arr.push(sound);
    let arrLength = arr.length;
    if (arrLength > 2) {
        arr.splice(0, arrLength - 2);
    }

    // if sound is true in the second value but false in the first, soundStart is true
    if (arr[0] === false && arr[1] === true) {
        soundStart = true;
    } else {
        soundStart = false;
    }

    // if sound is false in the second value but true in the first, soundEnd is true
    if (arr[0] === true && arr[1] === false) {
        soundEnd = true;
    } else {
        soundEnd = false;
    }

    return { soundStart, soundEnd, sound };
}

export function createAudioRecorder() {
    const audioRecorder = new MediaRecorder(stream);
    return audioRecorder;
}