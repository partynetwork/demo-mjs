import {delay, ProfileType} from "../App";
import {simulatePress} from "./keyboard";

export class SpammingEngage {
    isStorybook = false;
    flag = false;
    executeAllPresetsWhenStart = true;
    requestAnimationFrameIds: number[] = [];
    presets: ProfileType['presets'] = [];
    runningMode: 'focus' | 'blur' = 'focus';

    constructor(options: {
        presets: ProfileType['presets'],
        executeAllPresetsWhenStart?: boolean,
        isStorybook: boolean
    }) {
        this.presets = options.presets;
        this.isStorybook = options.isStorybook;
        if (options.executeAllPresetsWhenStart !== undefined) {
            this.executeAllPresetsWhenStart = options.executeAllPresetsWhenStart;
        }
    }

    start() {
        console.log('start');
        this.flag = true;
        if (this.executeAllPresetsWhenStart) {
            for (const preset of this.presets) {
                preset.ts = performance.now() - preset.duration;
            }
        }
        this.requestAnimationFrameIds.push(window.requestAnimationFrame(this.loop))
    }

    stop() {
        console.log('stop');
        this.flag = false;
        for (const id of this.requestAnimationFrameIds) {
            window.cancelAnimationFrame(id);
        }
        this.presets = [];
    }

    setPresets(presets: ProfileType['presets']) {
        this.presets = presets;
        return this;
    }

    setRunningMode(mode: 'focus' | 'blur') {
        this.runningMode = mode;
        return this;
    }

    loop = async (timestamp: number) => {
        if (!this.flag) return;
        for (const preset of this.presets) {
            const {duration, keypress, ts, alt, ctrl} = preset;
            const elapsedTime = timestamp - ts;
            const progress = Math.min(elapsedTime / duration, 1);
            if (progress >= 1) {
                const pressOptions = {
                    key: keypress,
                    ctrlKey: ctrl,
                    altKey: alt,
                };
                if (this.isStorybook) {
                    console.log('press', pressOptions);
                } else {
                    simulatePress(pressOptions);
                }
                await delay(preset.castingDuration);
                preset.ts = performance.now();
            }
        }
        if (!this.flag) return;
        this.requestAnimationFrameIds.push(window.requestAnimationFrame(this.loop));
    }
}
