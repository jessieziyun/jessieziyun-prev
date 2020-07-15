let mobile;

function isAndroid() {
    return /Android/i.test(navigator.userAgent);
}

function isiOS() {
    return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function isMobile() {
    return isAndroid() || isiOS();
}

function main() {
    mobile = isMobile();
    if (mobile) {
        let contentContainer = document.getElementsByClassName("content-container")[0];
        if(contentContainer !== undefined){
        contentContainer.style.marginTop = "100px";
        }

        let header = document.getElementsByTagName("header");
        for (let i = 0; i < header.length; i++) {
            header[i].style.top = "10px";
        }

        let h1Elements = document.getElementsByTagName("h1");
        for (let i = 0; i < h1Elements.length; i++) {
            h1Elements[i].style.fontSize = "32px";
        }

        let h2Elements = document.getElementsByTagName("h2");
        for (let i = 0; i < h2Elements.length; i++) {
            h2Elements[i].style.fontSize = "44px";
            h2Elements[i].style.lineHeight = "48px";
        }

        let h3Elements = document.getElementsByTagName("h3");
        for (let i = 0; i < h3Elements.length; i++) {
            h3Elements[i].style.fontSize = "20px";
            h3Elements[i].style.lineHeight = "22px";
        }

        let h4Elements = document.getElementsByTagName("h4");
        for (let i = 0; i < h4Elements.length; i++) {
            h4Elements[i].style.fontSize = "18px";
            h4Elements[i].style.lineHeight = "22px";
        }

        let pElements = document.getElementsByTagName("p");
        for (let i = 0; i < pElements.length; i++) {
            pElements[i].style.fontSize = "14px";
            pElements[i].style.lineHeight = "18px";
        }

        let smallElements = document.getElementsByTagName("small");
        for (let i = 0; i < smallElements.length; i++) {
            smallElements[i].style.fontSize = "12px";
            smallElements[i].style.lineHeight = "18px";
        }

        let contact = document.getElementById("contact");
        if (contact !== null) {
            contact.style.width = "100%";
            contact.style.marginTop = "0px";
        }

        let about = document.getElementById("about");
        if (about !== null) about.style.width = "100%";

        let flex = document.getElementsByClassName("flex-container");
        for (let i = 0; i < flex.length; i++) {
            flex[i].style.margin = "10px 0px";
        }

        let flex02 = document.getElementsByClassName("flex-container-0-2");
        for (let i = 0; i < flex02.length; i++) {
            flex02[i].style.width = "100%";
        }

        let flexTextThirds = document.getElementsByClassName("flex-thirds");
        for (let i = 0; i < flexTextThirds.length; i++) {
            flexTextThirds[i].style.margin = "-10px 0px";
        }

        let leftWide = document.getElementsByClassName("left-wide");
        for (let i = 0; i < leftWide.length; i++) {
            leftWide[i].style.width = "100%";
            leftWide[i].style.margin = "20px 0px";
        }
    }
}

window.addEventListener("DOMContentLoaded", () => {
    main();
});