import { Assets, Sprite } from "pixi.js";


export class Background extends Sprite {
    public constructor() {
        super(Assets.get("/assets/background.png"));
    }


    public static getAssetUrls(): string[] {
        return ["/assets/background.png"];
    }
}
