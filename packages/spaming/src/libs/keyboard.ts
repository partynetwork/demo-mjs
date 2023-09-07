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

export function simulatePress(e: Partial<KeyboardEventInit>) {
    const canvas = document.querySelector("canvas")
    if (e.altKey) {
        canvas.dispatchEvent(
            new KeyboardEvent("keydown", {
                key: "Alt",
                altKey: true,

            })
        )
    }
    if (e.ctrlKey) {
        canvas.dispatchEvent(
            new KeyboardEvent("keydown", {
                key: "Control",
                ctrlKey: true,
            })
        )
    }
    canvas.dispatchEvent(
        new KeyboardEvent("keydown", e)
    );
    canvas.dispatchEvent(
        new KeyboardEvent("keyup", e)
    );
    if (e.altKey) {
        canvas.dispatchEvent(
            new KeyboardEvent("keyup", {
                key: "Alt",
                altKey: true,
            })
        )
    }
    if (e.ctrlKey) {
        canvas.dispatchEvent(
            new KeyboardEvent("keyup", {
                key: "Control",
                ctrlKey: true,
            })
        )
    }
}
