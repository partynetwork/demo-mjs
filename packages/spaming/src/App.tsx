import * as React from "react";
import {twMerge} from "tailwind-merge";
import {FormSetup} from "./components/FormSetup";
import {Profile, ProfileProps} from "./components/Profile";
import {useEffect} from "react";
import {SpammingEngage} from "./libs/spamming-engage";

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
let runningMode: 'focus' | 'blur' = 'focus'
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const isStorybook = window.location.href.includes('localhost:6006')

const spammingEngage = new SpammingEngage({
    presets: [],
    isStorybook
})
const App = () => {
    const [state, setState] = React.useState<AppStateType>({
        ...initialAppState,
        ...JSON.parse(localStorage.getItem(localStorageName) || '{}'),
        showConfigForm: false,
        engage: null,
    })

    useEffect(() => {
        function onWindowBlur() {
            //not running full
            runningMode = 'blur'
            spammingEngage.setRunningMode(runningMode)
        }

        function onWindowFocus() {
//running full
            runningMode = 'focus'
            spammingEngage.setRunningMode(runningMode)
        }

        window.addEventListener('blur', onWindowBlur, false);
        window.addEventListener('focus', onWindowFocus, false);
        return () => {

        }
    }, []);
    const handleStop = (_) => {
        setState({...state, engage: null, showConfigForm: false, editProfile: null})
        spammingEngage.stop()
        handleFocus()
    }
    const handleStart = (profileIndex: number) => {
        const profile = state.profiles[profileIndex]
        const presets = profile.presets.map((preset) => ({
            ...preset,
            ts: performance.now(),
            keypress: preset.keypress.replace('alt_', '').replace('ctrl_', ''),
            alt: preset.keypress.includes('alt'),
            ctrl: preset.keypress.includes('ctrl'),
        }))
        setState({...state, engage: profile.id, showConfigForm: false, editProfile: null})
        spammingEngage
            .setPresets(presets)
            .start()
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
            <div className="card-body p-2 gap-1">
                <div className="w-full relative mb-2">
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
                            onClickPause={() => handleStop(index)}
                            presets={profile.presets}
                        />
                    </div>
                ))}
                <button
                    className={twMerge(
                        "btn btn-xs",
                        state.minimize ? "hidden" : "",
                        state.engage ? "hidden" : ""
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
