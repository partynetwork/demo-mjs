import * as React from "react";
import {twMerge} from "tailwind-merge";
import {simulatePress} from "./libs/keyboard";
import {FormSetup} from "./components/FormSetup";
import {Profile, ProfileProps} from "./components/Profile";

// const mainApp = document.getElementById('root');
const gameApp: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement;
const localStorageName = 'spam-v1.0.4'
export type ActionType = {
    keypress: string,
    duration: number,
    castingDuration: number,
    ts?: number | null,
    alt?: boolean,
    ctrl?: boolean,
}
export type ProfileType = {
    id: string,
    name: string,
    presets: ActionType[]
}
export type AppStateType = {
    engage: string | null,
    editProfile?: ProfileType | null,
    minimize: boolean,
    showConfigForm: boolean,
    activeProfileId?: string | null,
    animationFrameId?: number | null,
    profiles: ProfileType[]
}
const initialAppState: AppStateType = {
    engage: null,
    minimize: false,
    showConfigForm: false,
    activeProfileId: null,
    editProfile: null,
    profiles: [{
        id: '1',
        name: 'Profile 1',
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
    }],
}
let animationFrameId: number | null = null
let timeoutId: number | null = null
let runningMode: 'focus' | 'blur' = 'focus'
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const engage = async (timestamp: number, presets: ProfileType['presets']) => {
    // Calculate the animation progress between 0 and 1
    for (let preset of presets) {
        const {duration, keypress, ts, alt, ctrl} = preset;
        const elapsedTime = timestamp - ts;
        const progress = Math.min(elapsedTime / duration, 1);
        if (progress >= 1) {
            // console.log('press', keypress)
            simulatePress({
                key: keypress,
                ctrlKey: ctrl,
                altKey: alt,
            });
            await delay(preset.castingDuration)
            preset.ts = performance.now()
        }
    }
    // presets = presets.map((preset) => ({...preset, ts: performance.now()}))
    if (runningMode === 'focus') {
        animationFrameId = requestAnimationFrame((timestamp) => engage(timestamp, presets));
    } else {
        timeoutId = setTimeout(() => engage(performance.now(), presets), 100) as unknown as number
    }
}

window.addEventListener('blur', function () {
    //not running full
    runningMode = 'blur'
}, false);
window.addEventListener('focus', function () {
    //running optimal (if used)
    runningMode = 'focus'
}, false);
const App = () => {
    const [state, setState] = React.useState<AppStateType>({
        ...initialAppState,
        ...JSON.parse(localStorage.getItem(localStorageName) || '{}'),
        showConfigForm: false,
        engage: null,
    })
    const handleClearTimer = () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
    }
    const handleStop = () => {
        handleClearTimer()
        setState({...state, engage: null})
        handleFocus()
    }
    const handleStart = (profileIndex: number) => {
        handleClearTimer()
        const profile = state.profiles[profileIndex]
        const presets = profile.presets.map((preset) => ({
            ...preset,
            ts: performance.now(),
            keypress: preset.keypress.replace('alt_', '').replace('ctrl_', ''),
            alt: preset.keypress.includes('alt'),
            ctrl: preset.keypress.includes('ctrl'),
        }))
        setState({...state, engage: profile.id, showConfigForm: false, editProfile: null})
        animationFrameId = requestAnimationFrame((timestamp) => engage(timestamp, presets));
        handleFocus()
    }
    const handleMinimize = () => {
        setState({
            ...state,
            showConfigForm: false,
            minimize: !state.minimize,
            editProfile: null,
        })
        handleFocus()
    }
    const handleClickConfig = (profile: ProfileProps) => {
        const profileIndex = state.profiles.findIndex((item) => item.id === profile.id)
        if (state.showConfigForm == true) {
            setState({
                ...state,
                showConfigForm: false,
                editProfile: null,
            })
            return
        }
        setState({
            ...state,
            showConfigForm: true,
            editProfile: state.profiles[profileIndex]
        })
    }
    const handleFocus = () => {
        if (gameApp) {
            gameApp.focus();
        }
    }
    const handleSubmitForm = (data) => {
        const {editProfile} = state;
        let newState: React.SetStateAction<AppStateType>
        if (editProfile) {
            const newProfiles = state.profiles.map((item) => {
                if (item.id === editProfile.id) {
                    return {
                        ...item,
                        name: data.name,
                        presets: data.presets
                    }
                }
                return item
            })
            newState = {
                ...state,
                showConfigForm: false,
                editProfile: null,
                profiles: newProfiles
            }
            setState(newState)
        } else {
            const newProfile = {
                id: Math.random().toString(36).substring(7),
                name: data.name,
                presets: data.presets
            }
            newState = {
                ...state,
                showConfigForm: false,
                editProfile: null,
                profiles: [...state.profiles, newProfile]
            }
            setState(newState)
        }
        localStorage.setItem(localStorageName, JSON.stringify(newState))
        handleClearTimer()
        handleFocus()
    }
    const handleClickAddProfile = () => {
        const newProfile = {
            id: Math.random().toString(36).substring(7),
            name: `Profile ${state.profiles.length + 1}`,
            presets: [{
                keypress: '1',
                duration: 300,
                castingDuration: 0
            }]
        }
        setState({
            ...state,
            profiles: [...state.profiles, newProfile]
        })
        handleFocus()
    }
    const handleClickRemove = (profile: ProfileProps) => {
        const newProfiles = state.profiles.filter((item) => item.id !== profile.id)
        setState({
            ...state,
            profiles: newProfiles
        })
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
                    </div>
                </div>
                {state.profiles.map((profile, index) => (
                    <div className="flex flex-col gap-2" key={index}>
                        <Profile
                            id={profile.id}
                            name={profile.name}
                            disabled={state.engage !== profile.id && state.engage !== null}
                            engage={state.engage === profile.id}
                            minimize={state.minimize}
                            onClickConfig={handleClickConfig}
                            onClickRemove={handleClickRemove}
                            onClickPlay={() => handleStart(index)}
                            onClickPause={handleStop}
                            presets={profile.presets}
                        />
                    </div>
                ))}
                <button
                    className={twMerge(
                        "btn btn-xs",
                        state.minimize ? "hidden" : ""
                    )}
                    onClick={handleClickAddProfile}
                >
                    Add Profile
                </button>
                {state.showConfigForm && (
                    <div className="flex flex-col gap-1">
                        <div className="divider my-0 p-0"></div>
                        <FormSetup onSubmit={handleSubmitForm}
                                   formData={state.editProfile || null}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

export default App;
