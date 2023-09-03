
function simulateClick(ele: HTMLElement, x, y) {
    ele.dispatchEvent(
        new MouseEvent("mousedown", {
            clientX: x,
            clientY: y,
        })
    );

    ele.dispatchEvent(
        new MouseEvent("mouseup", {
            clientX: x,
            clientY: y,
        })
    );
}

export function simulatePress(key: string) {
    document.querySelector("canvas").dispatchEvent(
        new KeyboardEvent("keydown", {
            key,
        })
    );
    document.querySelector("canvas").dispatchEvent(
        new KeyboardEvent("keyup", {
            key,
        })
    );
}
