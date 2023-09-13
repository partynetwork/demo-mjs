import {delay, ProfileType} from "../App";
import {simulatePress} from "./keyboard";

export class SpammingEngage {

    isStorybook: boolean = false;
    flag: boolean = false;
    executeAllPresetsWhenStart: boolean = true;
    requestAnimationFrameId: number = 0;
    timerId: number = 0;

    presets: ProfileType['presets'] = []
    runningMode: 'focus' | 'blur' = 'focus';

    constructor(options: {
        presets: ProfileType['presets'],
        executeAllPresetsWhenStart?: boolean,
        isStorybook: boolean
    }) {
        this.presets = options.presets;
        this.isStorybook = options.isStorybook;
        if (typeof options?.executeAllPresetsWhenStart !== 'undefined') {
            this.executeAllPresetsWhenStart = options.executeAllPresetsWhenStart;
        }
    }

    start() {
        console.log('start')
        this.flag = true;
        if (this.executeAllPresetsWhenStart) {
            this.presets = this.presets.map(preset => {
                preset.ts = performance.now() - preset.duration;
                return preset;
            })
        }
        this.requestAnimationFrameId = window.requestAnimationFrame(this.loop);
    }

    stop() {
        console.log('stop')
        this.flag = false;
        window.cancelAnimationFrame(this.requestAnimationFrameId);
        this.presets = [];
    }

    setPresets(presets: ProfileType['presets']) {
        this.presets = presets;
        return this
    }

    setRunningMode(mode: 'focus' | 'blur') {
        this.runningMode = mode;
        return this
    }

    loop = async (timestamp: number) => {
        if (!this.flag) return;
        for (let preset of this.presets) {
            const {duration, keypress, ts, alt, ctrl} = preset;
            const elapsedTime = timestamp - ts;
            const progress = Math.min(elapsedTime / duration, 1);
            if (progress >= 1) {
                if (this.isStorybook) {
                    console.log('press', {
                        key: keypress,
                        ctrlKey: ctrl,
                        altKey: alt,
                    })
                } else {
                    simulatePress({
                        key: keypress,
                        ctrlKey: ctrl,
                        altKey: alt,
                    });
                }
                await delay(preset.castingDuration)
                preset.ts = performance.now()
            }
        }
        // if (this.runningMode === 'blur') {
        //     this.timerId = window.setTimeout(() => {
        //         this.requestAnimationFrameId = window.requestAnimationFrame(this.loop);
        //     }, 100)
        // } else {
        if (!this.flag) return;
        this.requestAnimationFrameId = window.requestAnimationFrame(this.loop);
        // }
    }

}