import * as React from "react";
import {twMerge} from "tailwind-merge";
import {simulatePress} from "./libs/keyboard";
import {FormSetup} from "./components/FormSetup";
import {useEffect, useRef} from "react";

const mainApp = document.getElementById('root');
const gameApp: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement;

type ActionType = {
    keypress: string,
    duration: number,
    castingDuration: number,
    ts?: number | null,
}
export type AppStateType = {
    engage: boolean,
    minimize: boolean,
    showConfigForm: boolean,
    animationFrameId?: number | null,
    presets: ActionType[]
}
const initialAppState: AppStateType = {
    engage: false,
    minimize: false,
    showConfigForm: false,
    presets: [
        {
            keypress: '1',
            duration: 300,
            castingDuration: 0
        },
        {
            keypress: '2',
            duration: 300,
            castingDuration: 0
        }
    ]
}
let animationFrameId: number | null = null
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const engage = (
    timestamp: number,
    formState: AppStateType
) => {
    // Calculate the animation progress between 0 and 1
    // console.log('elapsedTime', elapsedTime)
    formState.presets.forEach(async (actionType, index) => {
        const {duration, keypress, ts} = actionType;
        const elapsedTime = timestamp - ts;
        const progress = Math.min(elapsedTime / duration, 1);
        if (progress >= 1) {
            simulatePress(keypress);
            await delay(actionType.castingDuration);
            formState.presets[index].ts = performance.now();
        }
    });
    animationFrameId = requestAnimationFrame((timestamp) => engage(timestamp, formState));
}


const App = () => {
    const [state, setState] = React.useState<AppStateType>({
        ...initialAppState,
        ...JSON.parse(localStorage.getItem('formState') || '{}')
    })
    const handleStop = () => {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
        setState({...state, engage: false})
        handleFocus()
    }
    const handleStart = () => {
        setState({...state, engage: true})
        const presets = state.presets.map((preset) => ({...preset, ts: performance.now()}))
        animationFrameId = requestAnimationFrame((timestamp) => engage(timestamp, {
            ...state,
            presets
        }));
        handleFocus()
    }
    const handleMinimize = () => {
        setState({
            ...state,
            showConfigForm: false,
            minimize: !state.minimize
        })
        handleFocus()
    }
    const handleClickConfig = () => {
        setState({
            ...state,
            showConfigForm: !state.showConfigForm,
            minimize: false
        })
    }
    const handleFocus = () => {
        if (gameApp) {
            gameApp.focus();
        }
    }
    const handleSubmitForm = (data) => {
        localStorage.setItem('formState', JSON.stringify(data));
        const newState = data.presets.filter((preset) => preset.keypress !== '')
        setState({...state, ...data, presets: newState})
        handleFocus()
    }
    return (
        <div className={twMerge(
            "absolute top-0 left-0 card shadow-xl min-w-24 z-50 bg-base-100",
            state.minimize ? "w-32" : "w-[362px]"
        )}>
            <div className="card-body p-4">
                <div className="w-full  h-10 relative">
                    <div className="flex justify-end items-end gap-1 right-2">
                        <button
                            onClick={() => handleFocus()}
                            className={twMerge(
                                "btn btn-square btn-xs text-md",
                                document.activeElement === gameApp ? "btn-primary" : "btn-neutral btn-outline"
                            )}>
                            F
                        </button>
                        <button
                            onClick={() => handleMinimize()}
                            className={twMerge(
                                "btn btn-square btn-xs btn-outline btn-neutral text-md",
                            )}>
                            {state.minimize ? '>' : '<'}
                        </button>
                        <button
                            onClick={() => handleClickConfig()}
                            className="btn btn-square btn-xs btn-outline btn-neutral">
                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="18px" viewBox="0 0 24 24"
                                 stroke="currentColor" fill="currentColor">
                                <path
                                    d="M 9.6679688 2 L 9.1757812 4.5234375 C 8.3550224 4.8338012 7.5961042 5.2674041 6.9296875 5.8144531 L 4.5058594 4.9785156 L 2.1738281 9.0214844 L 4.1132812 10.707031 C 4.0445153 11.128986 4 11.558619 4 12 C 4 12.441381 4.0445153 12.871014 4.1132812 13.292969 L 2.1738281 14.978516 L 4.5058594 19.021484 L 6.9296875 18.185547 C 7.5961042 18.732596 8.3550224 19.166199 9.1757812 19.476562 L 9.6679688 22 L 14.332031 22 L 14.824219 19.476562 C 15.644978 19.166199 16.403896 18.732596 17.070312 18.185547 L 19.494141 19.021484 L 21.826172 14.978516 L 19.886719 13.292969 C 19.955485 12.871014 20 12.441381 20 12 C 20 11.558619 19.955485 11.128986 19.886719 10.707031 L 21.826172 9.0214844 L 19.494141 4.9785156 L 17.070312 5.8144531 C 16.403896 5.2674041 15.644978 4.8338012 14.824219 4.5234375 L 14.332031 2 L 9.6679688 2 z M 12 8 C 14.209 8 16 9.791 16 12 C 16 14.209 14.209 16 12 16 C 9.791 16 8 14.209 8 12 C 8 9.791 9.791 8 12 8 z"/>
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="flex flex-wrap gap-2 w-full h-full">
                    <button
                        className={twMerge(
                            "btn btn-xs",
                            state.minimize ? "w-full" : "w-24",
                            state.engage ? "btn-neutral" : "btn-primary"
                        )}
                        onClick={() => {
                            if (state.engage) {
                                handleStop()
                            } else {
                                handleStart()
                            }
                        }}
                    >
                        {state.engage ? 'Pause' : 'Play'}
                    </button>
                    {!state.minimize && (
                        <>
                            {!state.presets?.length && (
                                <p className="text-sm uppercase italic">
                                    - No key set -
                                </p>
                            )}
                            {
                                state.presets.map((preset, index) => (
                                    <kbd className="kbd kbd-sm">{preset.keypress}</kbd>
                                ))
                            }
                        </>
                    )}
                </div>
                {
                    state.showConfigForm && (
                        <div className="flex flex-col gap-2">
                            <div className="divider my-1"></div>
                            <FormSetup formData={state} onSubmit={handleSubmitForm}/>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default App;