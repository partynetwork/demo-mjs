function createTextureFromArray(gl, dataArray, type, width, height) {
    var data = new Uint8Array(dataArray);
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, type, width, height, 0, type, gl.UNSIGNED_BYTE, data);
    return texture;
}

export function captureImage(
    canvas: HTMLCanvasElement,
    options?: {
        width: number;
        height: number;
        x: number;
        y: number;
    }
): {
    width: number;
    height: number;
    imageSrc: string;
} {
    const {width, height, x, y} = options || {
        width: canvas.width,
        height: canvas.height,
        x: 0,
        y: 0,
    }
    const gl = canvas.getContext("webgl", {preserveDrawingBuffer: true});
    const pixels = new Uint8Array(width * height * 4)
    gl.readPixels(x, y, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    const imageData = new Uint8ClampedArray(width * height * 4);
    for (let i = 0; i < width * height * 4; i += 4) {
        imageData[i] = pixels[i + 2];
        imageData[i + 1] = pixels[i + 1];
        imageData[i + 2] = pixels[i];
        imageData[i + 3] = pixels[i + 3];
    }
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempContext = tempCanvas.getContext("2d");
    const tempImageData = tempContext.createImageData(width, height);
    tempContext.putImageData(tempImageData, 0, 0);
    const image = new Image();
    image.src = tempContext.canvas.toDataURL();
    tempCanvas.remove();
    return {
        width: canvas.width,
        height: canvas.height,
        imageSrc: image.src
    };
}

function convertToGrayscale(inputContext: CanvasRenderingContext2D, inputCanvas: HTMLCanvasElement, outputContext: CanvasRenderingContext2D, outputCanvas: HTMLCanvasElement) {
    const imageData = inputContext.getImageData(0, 0, inputCanvas.width, inputCanvas.height);

    for (let i = 0; i < imageData.data.length; i += 4) {
        const r = imageData.data[i];
        const g = imageData.data[i + 1];
        const b = imageData.data[i + 2];
        const average = (r + g + b) / 3;

        imageData.data[i] = imageData.data[i + 1] = imageData.data[i + 2] = average;
    }

    outputCanvas.width = inputCanvas.width;
    outputCanvas.height = inputCanvas.height;

    outputContext.putImageData(imageData, 0, 0);
}

// Function to convert ArrayBuffer to base64
export function arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;

    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }

    return window.btoa(binary);
}