// LANDING PAGE AND LOADING SCREEN CODE

// create text elements for the landing page
export function createLandingPageText(div) {
    const header = document.createElement("h1");
    const headerNode = document.createTextNode("SPEECH BUBBLES");
    header.appendChild(headerNode);
    header.style.color = "#ffef9e";
    header.style.fontSize = "32px";
    header.style.fontWeight = "lighter";
    header.style.fontStyle = "italic";
    header.style.letterSpacing = "50px";
    header.style.lineHeight = "50px";

    const subheading = document.createElement("h2");
    const subheadingNode = document.createTextNode("BLOW DIGITAL BUBBLES WITH SOUND");
    subheading.appendChild(subheadingNode);
    subheading.style.color = "white";
    subheading.style.fontSize = "20px";
    subheading.style.fontWeight = "lighter";
    subheading.style.letterSpacing= "50px";
    subheading.style.lineHeight = "50px";
    subheading.style.marginTop = "75px";

    const info = document.createElement("h3");
    const infoNode = document.createTextNode("Please allow access to the camera and microphone to view. Place an ear within a bubble to hear the sound in it!");
    info.appendChild(infoNode);
    info.style.color = "#ffef9e";
    info.style.fontSize = "20px";
    info.style.fontWeight = "lighter";
    info.style.letterSpacing= "10px";
    info.style.lineHeight = "35px";
    info.style.marginTop = "75px";
    info.style.marginBottom = "75px";

    div.appendChild(header);
    div.appendChild(subheading);
    div.appendChild(info);
}

// create "enter sketch" button
export function createButton(div) {
    const button = document.createElement("button");

    button.style.position = "absolute";
    button.style.width = "200px";
    button.style.left = "calc(50% - 100px)";
    button.style.border = "1px solid #fff";
    button.style.borderRadius = "4px";
    button.style.padding = "12px 0px 12px 12px";
    button.style.color = "#fff";
    button.style.background = "none";
    button.style.font = "18px Helvetica";
    button.style.cursor = "pointer";
    button.textContent = "ENTER";
    button.style.letterSpacing= "10px";

    button.onmouseenter = () => {
        button.style.color = "#ffef9e";
        button.style.border = "1px solid #ffef9e";
    };

    button.onmouseleave = () => {
        button.style.color = "#fff";
        button.style.border = "1px solid #fff";
    };

    div.appendChild(button);
    return button;
}

// if the button is pressed, hide the div
export function buttonPressed(button, div, bg) {
    return new Promise(resolve => {
        button.onclick = () => {
            hideDiv(div);
            hideDiv(bg);
            let clicked = true;
            resolve(clicked);
        };
    });
}

export function hideDiv(div) {
    if (div.style.display !== "none") {
        div.style.display = "none";
    } else {
        div.style.display = "block";
    }
}

// create the loading screen
export function createLoadingScreen(div) {
    const loadingText = document.createElement("h1");
    const textNode = document.createTextNode("MODEL LOADING");
    loadingText.appendChild(textNode);
    loadingText.style.color = "#ffef9e";
    loadingText.style.fontSize = "24px";
    loadingText.style.fontWeight = "lighter";
    loadingText.style.fontStyle = "italic";
    loadingText.style.letterSpacing= "50px";
    loadingText.style.lineHeight = "50px";
    div.appendChild(loadingText);
}