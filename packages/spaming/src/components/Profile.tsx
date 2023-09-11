import * as React from "react";
import {twMerge} from "tailwind-merge";
import {ActionType} from "../App";

export interface ProfileProps {
    id?: string,
    name: string,
    engage: boolean,
    minimize: boolean,
    disabled: boolean,
    presets: ActionType[]
    onClickPlay?: (data: ProfileProps) => void,
    onClickPause?: (data: ProfileProps) => void,
    onClickRemove?: (data: ProfileProps) => void,
    onClickConfig?: (data: ProfileProps) => void,
}

export const Profile: React.FC<ProfileProps> = (props) => {
    const {
        name,
        engage,
        minimize,
        presets,
        disabled,
    } = props
    const handleClickConfig = (data: ProfileProps) => {
        if (typeof props.onClickConfig === 'function') {
            props.onClickConfig(data)
        }
    }
    const handleClickRemove = (data: ProfileProps) => {
        if (typeof props.onClickRemove === 'function') {
            props.onClickRemove(data)
        }
    }
    const handleClickPlayOrPause = () => {
        if (engage) {
            if (typeof props.onClickPause === 'function') {
                props.onClickPause(props)
            }
        } else {
            if (typeof props.onClickPlay === 'function') {
                props.onClickPlay(props)
            }
        }
    }
    return (
        <div className="flex flex-wrap gap-1 w-full h-full">
            <button
                type="button"
                className={twMerge(
                    "btn btn-xs btn-active",
                    minimize ? "w-full" : "w-24",
                    engage ? "btn-error animate-pulse" : "btn-primary",
                    disabled ? "btn-disabled" : ''
                )}
                onClick={() => handleClickPlayOrPause()}
            >
                {engage ? 'Stop' : name}
            </button>
            {!minimize && (
                <>
                    <button
                        type="button"
                        onClick={() => {
                            if (!disabled) handleClickConfig(props)
                        }}
                        className={twMerge(
                            "btn btn-square btn-xs btn-outline btn-neutral",
                            disabled||engage ? "btn-disabled" : ''
                        )}>
                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="18px" viewBox="0 0 24 24"
                             stroke="currentColor" fill="currentColor">
                            <path
                                d="M 9.6679688 2 L 9.1757812 4.5234375 C 8.3550224 4.8338012 7.5961042 5.2674041 6.9296875 5.8144531 L 4.5058594 4.9785156 L 2.1738281 9.0214844 L 4.1132812 10.707031 C 4.0445153 11.128986 4 11.558619 4 12 C 4 12.441381 4.0445153 12.871014 4.1132812 13.292969 L 2.1738281 14.978516 L 4.5058594 19.021484 L 6.9296875 18.185547 C 7.5961042 18.732596 8.3550224 19.166199 9.1757812 19.476562 L 9.6679688 22 L 14.332031 22 L 14.824219 19.476562 C 15.644978 19.166199 16.403896 18.732596 17.070312 18.185547 L 19.494141 19.021484 L 21.826172 14.978516 L 19.886719 13.292969 C 19.955485 12.871014 20 12.441381 20 12 C 20 11.558619 19.955485 11.128986 19.886719 10.707031 L 21.826172 9.0214844 L 19.494141 4.9785156 L 17.070312 5.8144531 C 16.403896 5.2674041 15.644978 4.8338012 14.824219 4.5234375 L 14.332031 2 L 9.6679688 2 z M 12 8 C 14.209 8 16 9.791 16 12 C 16 14.209 14.209 16 12 16 C 9.791 16 8 14.209 8 12 C 8 9.791 9.791 8 12 8 z"/>
                        </svg>
                    </button>
                    <button
                        onClick={() => handleClickRemove(props)}
                        className={twMerge(
                            "btn btn-square btn-xs btn-error",
                            disabled||engage ? "btn-disabled" : ''
                        )}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-2 w-2" fill="none"
                             viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                    <div>
                        {!presets?.length && (
                            <p className="text-sm uppercase italic">
                                - No key set -
                            </p>
                        )}
                        {presets.map((preset, index) => (
                            <kbd className="kbd kbd-sm" key={index}>{preset.keypress}</kbd>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}