import { Text } from "pixi.js";
import { appConfig } from "./appConfig";


export class TimerLabel extends Text {
    public constructor(initialRemainingTime: number) {
        super({
            text: "-",
            style: {
                fontFamily: "Arial",
                fontSize: 24,
                fill: 0xFF00FF,
                align: "center"
            }
        });

        this.change(initialRemainingTime);

        const padding = 10;
        this.x = appConfig.canvasWidth - this.width - padding;
        this.y = appConfig.canvasHeight - this.height - padding;
    }


    public change(remainingTime: number): void {
        const remainingTimeSeconds = Math.ceil(remainingTime / 1000);
        this.text = `${remainingTimeSeconds}s`;
    }
}
