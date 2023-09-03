import * as React from 'react';
import {createRoot} from 'react-dom/client';
import App from "./App";

waitForElement("#canvas", (element) => {
    // Element found, perform actions
    console.log("Element found:", element);

    const domNode = document.createElement("div");
    domNode.setAttribute('id', 'root');
    document.body.appendChild(domNode);

    const root = createRoot(domNode)
    Promise.all([
        loadScriptFromCDN("https://cdn.tailwindcss.com"),
        loadScriptFromCDN("https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.8.1/flowbite.min.js"),
        loadStyleFromCDN("https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.8.1/flowbite.min.css"),
    ]).then(() => {
        root.render(<App/>)
    })
});

async function loadScriptFromCDN(url) {
    const script = document.createElement("script");
    script.src = url;
    document.head.appendChild(script);
}

async function loadStyleFromCDN(url) {
    const style = document.createElement("link");
    style.href = url;
    style.rel = 'stylesheet';
    document.head.appendChild(style);
}


function waitForElement(selector, callback, interval = 100) {
    const intervalId = setInterval(() => {
        const element = document.querySelector(selector);
        if (element) {
            clearInterval(intervalId);
            callback(element);
        }
    }, interval);
}