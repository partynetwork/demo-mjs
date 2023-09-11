import {delay, ProfileType} from "../App";
import {simulatePress} from "./keyboard";

export class SpammingEngage {

    isStorybook: boolean = false;
    flag: boolean = false;
    requestAnimationFrameId: number = 0;
    presets: ProfileType['presets'] = []

    constructor(options: { presets: ProfileType['presets'], isStorybook: boolean }) {
        this.presets = options.presets;
        this.isStorybook = options.isStorybook;
    }

    start() {
        console.log('start')
        this.flag = true;
        this.requestAnimationFrameId = window.requestAnimationFrame(this.loop);
    }

    stop() {
        console.log('stop')
        this.flag = false;
        this.presets = [];
        window.cancelAnimationFrame(this.requestAnimationFrameId);
    }

    setPresets(presets: ProfileType['presets']) {
        this.presets = presets;
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
        this.requestAnimationFrameId = window.requestAnimationFrame(this.loop);
    }

}