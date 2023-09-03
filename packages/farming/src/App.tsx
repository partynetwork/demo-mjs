import * as React from "react";
import {Button} from "./components/Button";
import {captureImage} from "./libs/image-transform";

const mainApp = document.getElementById('root');
const gameApp: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement;
const App = () => {
    const imageRef = React.useRef<HTMLImageElement>(null)
    const handleClickCapture = () => {
        const result = captureImage(gameApp)
        console.log('result', result)
        if (imageRef.current) {
            imageRef.current.src = result.imageSrc
        }
    }
    return (
        <div className="absolute w-full left-2.5 top-2.5 p-1 rounded"
             style={{maxWidth: '200px', minHeight: '200px', 'background': 'rgba(0,0,0,.4)'}}>
            <img ref={imageRef} width="200" height="200" alt=""/>
            <Button
                onClick={handleClickCapture}
            >
                Capture
            </Button>
        </div>
    )
}

export default App;