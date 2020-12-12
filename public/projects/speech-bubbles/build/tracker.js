// FACEMESH AND BUBBLES CODE

import * as THREE from "/js/third-party/three.module.js";
import { FaceMeshFaceGeometry } from "/js/third-party/face.js";
import { createCubeMapTexture } from "./scene.js"

const cubemaptexture = createCubeMapTexture();
const shader = cubemaptexture.shader;
const uniforms = cubemaptexture.uniforms;

export function createFaceObject(scene, width, height) {
    const faceGeometry = new FaceMeshFaceGeometry();
    faceGeometry.setSize(width, height);

    const wireframeMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
    });

    const faceMesh = new THREE.Mesh(faceGeometry, wireframeMaterial);
    scene.add(faceMesh);
    return faceGeometry;
}

export function createBubbles(numberOfBubbles, scene) {

    let bubbleArray = [];

    for (let i = 0; i < numberOfBubbles; i++) {
        let bubble = new Object3DBubble(scene);
        let randomHue = Math.random() * 255;
        let colour = new THREE.Color(`hsl(${randomHue}, 100%, 50%)`);
        bubble.initialise(colour);
        bubble.display();
        bubbleArray.push(bubble);
    }

    return bubbleArray;
}

function Object3DBubble(scene){

    const Bubble = new THREE.Object3D();
    const sphereRadius = 1;
    const widthSegments = 16;
    const heightSegments = 16;
    const geometry = new THREE.SphereBufferGeometry(sphereRadius, widthSegments, heightSegments);
    const transparentMaterial = new THREE.ShaderMaterial( {
        uniforms: uniforms,
        vertexShader: shader.vertexShader,
        fragmentShader: shader.fragmentShader
    } );
    const material = new THREE.MeshBasicMaterial();
    const mesh = new THREE.Mesh(geometry, transparentMaterial);
    Bubble.add(mesh);
    scene.add(Bubble);

    this.position = new THREE.Vector3();

    this.initialise = (colour) => {
        this.position.x = -1000;
        this.position.y = -1000;
        this.position.z = 0;
        this.scale = new THREE.Vector3(0, 0, 0);
        // mesh.material.color.set(colour);
    };

    this.update = (scale, track) => {
        this.position.x = track.position.x;
        this.position.y = track.position.y;
        this.position.z = track.position.z;
        this.scale = new THREE.Vector3(scale, scale, scale);
    };

    this.display = () => {
        Bubble.position.x = this.position.x;
        Bubble.position.y = this.position.y;
        Bubble.position.z = this.position.z;
        Bubble.scale.copy(this.scale);
    };
}