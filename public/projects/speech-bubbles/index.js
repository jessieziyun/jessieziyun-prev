import * as THREE from "/js/third-party/three.module.js"; // using Three.js to create 3D scene and objects
import { OrbitControls } from "/js/third-party/OrbitControls.js"; // Orbit Controls allow navigation with the mouse and trackpad
import * as SceneSetup from "./build/scene.js"; // All my Three.js scene setup code is in here
import * as Pages from "./build/pages.js"; // Contains code regarding the landing page and loading screen of the webpage
import * as Media from "./build/media.js"; // Code related to user media: getting and processing webcam/microphone streams
import { createFaceObject, createBubbles } from "./build/tracker.js"; // code for the objects that populate the scene: face mesh and bubbles

let flipHorizontal = true; // flip video so that the stream is mirrored
let width = 0, height = 0; // initial values for the width and height of the video stream
let faceGeometry; // 3D facemesh object
let userFace, userMouth, userLeftEar, userRightEar; // objects containing coordinates of user face positions
let bubbles; // to store an array containing bubble objects
let soundArray = []; // to store an array containing the two most recent sound values
let mic, sound, start, end; // audio stream variables
let scale, x; // to manipulate size of bubble objects
let count = 0; // to loop through the bubble objects array
let audioChunks = []; // array of audio chunks that make up an audio recording
let audioArray = []; // array of recorded audio stored in bubbles
let distanceArray = []; // two most recent values for distance between user ears and bubbles
const numberOfBubbles = 10; // maximum number of bubbles to be displayed at any one time
const threshold = 80; // minimum volume at which sound=true
const bubbleRadiusSF = 15; // scale factor for increasing bubble radius

const landingPage = document.getElementById("landing-page"); // landing page div
const landingPageBg = document.getElementById("landing-bg"); // landing page background image
const loadingScreen = document.getElementById("loading-screen"); // loading screen div
const loadingScreenBg = document.getElementById("loading-bg"); // loading screen background image

function main() {

  // create landing page and loading screen
  Pages.createLandingPageText(landingPage);
  Pages.createLoadingScreen(loadingScreen);
  const button = Pages.createButton(landingPage);

  // if the "enter" button is pressed, start the sketch
  Pages.buttonPressed(button, landingPage, landingPageBg).then((clicked) => {
    console.log("clicked");
    if (clicked === true) {
      const audioCtx = new(window.AudioContext || window.webkitAudioContext)();
      const analyser = audioCtx.createAnalyser();
      analyser.smoothingTimeConstant = 0.2;
      init(audioCtx, analyser);
    }
  })
}

async function init(audioCtx, analyser) {

  // scene setup
  const container = document.querySelector("#scene-container");
  const scene = new THREE.Scene();
  const textureCube = SceneSetup.createCubeMapTexture().textureCube;
  scene.background = textureCube;
  const camera = SceneSetup.createCamera(scene);
  const renderer = SceneSetup.createRenderer(container, width, height);
  const controls = new OrbitControls(camera, renderer.domElement);

  // initialise video and audio streams
  try {
    const video = await Media.loadStream(audioCtx, analyser);
  } catch (err) {
    throw err;
  }

  // create an audio recorder
  const audioRecorder = Media.createAudioRecorder();

  // initialise facemesh
  const model = await facemesh.load({ maxFaces: 1 });
  Pages.hideDiv(loadingScreen);
  Pages.hideDiv(loadingScreenBg);

  // create user face object
  faceGeometry = createFaceObject(scene, width, height);
  bubbles = createBubbles(numberOfBubbles, scene);

  // set width and height according to video dimensions
  if (width !== video.videoWidth || height !== video.videoHeight) {
    const w = video.videoWidth;
    const h = video.videoHeight;
    width = w;
    height = h;
    resize(camera, renderer);
    faceGeometry.setSize(w, h);
  }

  // render scene
  renderer.setAnimationLoop(() => {
    detect(video, model)
      .then(predictions => {
        // draw face mesh and get tracking points
        userFace = drawFace(predictions);
        userMouth = userFace.mouth;
        userLeftEar = userFace.leftEar;
        userRightEar = userFace.rightEar;

        // process microphone stream
        mic = Media.getSound(analyser, soundArray, threshold);
        start = mic.soundStart;
        end = mic.soundEnd;
        sound = mic.sound;

        // if the start of a sound input is detected, start the audio recorder
        if (start) {
          audioRecorder.start();
        }
        // if sound is being detected, increase bubble size logarithmically and record the sound
        if (sound) {
          audioRecorder.ondataavailable = e => {
            audioChunks.push(e.data);
          }
          scale = Math.log(x + 1) * bubbleRadiusSF;
          bubbles[count].update(scale, userMouth);
          x++;
        }
        // if the sound input ends, release the bubble and stop the audio recorder
        if (end) {
          audioRecorder.stop();
          audioRecorder.onstop = () => {
            const audio = document.createElement('audio');
            const blob = new Blob(audioChunks, {
                'type': 'audio/ogg; codecs=opus'
            });
            const audioURL = URL.createObjectURL(blob);
            audio.src = audioURL;
            audioArray.push(audio);
            if (audioArray.length > numberOfBubbles) {
                audioArray.splice(0, audioArray.length - numberOfBubbles);
            }
          }
          // reset scale variables for next bubble
          scale = 0;
          x = 0;
          // advance to next bubble in the array
          count++;
          if (count === bubbles.length) count = 0;
        }
        // render all the bubbles
        for (let i = 0; i < bubbles.length; i++) {
          bubbles[i].display();
          let withinBounds = checkWithinBounds(i, bubbles, userLeftEar, userRightEar, distanceArray);
          if (withinBounds === true) {
            audioArray[i].play();
            continue;
          }
        }
      })
      .catch(err => console.error(err));
    renderer.render(scene, camera);
  });

  // if the user resizes the window, adjust everything accordingly
  window.addEventListener("resize", () => {
    resize(camera, renderer);
  });
}

// predict face coordinates
async function detect(video, model) {
  const predictions = await model.estimateFaces(video, false, flipHorizontal);
  return predictions;
}

// draw the user's face geometry and return the mouth tracking points
function drawFace(predictions) {
  if (predictions.length > 0) {
    faceGeometry.update(predictions[0], flipHorizontal);
    let mouth = faceGeometry.track(38, 268, 15);
    let rightEar = faceGeometry.track(234, 93, 137);
    let leftEar = faceGeometry.track(453, 323, 366);
    return {mouth, leftEar, rightEar};
  }
}

// check if either of the user's ears have entered a bubble
function checkWithinBounds(i, bubbles, userLeftEar, userRightEar, distanceArray) {
  let withinBubble;
  let enteredBubble;

  // find distance between centre of bubble and user ears
  let bubblePosition = bubbles[i].position;
  let bubbleRadius = bubbles[i].scale.x;
  let distanceToLeftEar = userLeftEar.position.distanceTo(bubblePosition);
  let distanceToRightEar = userRightEar.position.distanceTo(bubblePosition);
  
  // if either ear has entered the radius of a bubble, enteredBubble is true
  distanceToLeftEar < bubbleRadius || distanceToRightEar < bubbleRadius ? withinBubble = true : withinBubble = false
  distanceArray.push(withinBubble);
  if (distanceArray.length > 2) distanceArray.splice(0, distanceArray.length - 2);
  distanceArray[0] === false && distanceArray[1] === true ? enteredBubble = true : enteredBubble = false;
  
  return enteredBubble;
}

// make sure the sketch fits the dimensions of the client browser window
function resize(camera, renderer) {
  const videoAspectRatio = width / height;
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const windowAspectRatio = windowWidth / windowHeight;
  let adjustedWidth;
  let adjustedHeight;
  if (videoAspectRatio < windowAspectRatio) {
    adjustedWidth = windowWidth;
    adjustedHeight = windowWidth / videoAspectRatio;
  } else {
    adjustedWidth = windowHeight * videoAspectRatio;
    adjustedHeight = windowHeight;
  }
  renderer.setSize(adjustedWidth, adjustedHeight);
  camera.aspect = videoAspectRatio;
  camera.updateProjectionMatrix();
}

main();