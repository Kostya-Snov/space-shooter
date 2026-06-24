import { Text } from "pixi.js";
import { appConfig } from "./appConfig";


export class ResultLabel extends Text {
    public constructor(text: string, color: number) {
        super({
            text,
            style: {
                fontFamily: "Arial",
                fontSize: 48,
                fill: color,
                align: "center"
            }
        });

        this.x = (appConfig.canvasWidth - this.width) / 2;
        this.y = (appConfig.canvasHeight - this.height) / 2;
    }
}
