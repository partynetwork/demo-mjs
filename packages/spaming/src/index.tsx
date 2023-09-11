import * as React from 'react';
import {createRoot} from 'react-dom/client';
import App, {delay} from "./App";

waitForElement("#canvas", (element) => {
    // Element found, perform actions
    console.log("Element found:", element);

    Promise.all([
        loadScriptFromCDN("https://cdn.tailwindcss.com"),
        loadScriptFromCDN("https://cdnjs.cloudflare.com/ajax/libs/rxjs/7.8.1/rxjs.umd.min.js"),
        loadStyleFromCDN("https://cdn.jsdelivr.net/npm/daisyui@3.6.4/dist/full.css"),
    ]).then(async () => {
        const domNode = document.createElement("div");
        domNode.setAttribute('id', 'root');
        document.body.appendChild(domNode);
        const root = createRoot(domNode)
        await delay(5000)
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