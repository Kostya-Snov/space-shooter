import { Assets, Sprite } from "pixi.js";


export class Background extends Sprite {
    public constructor() {
        super(Assets.get("background-1.png"));
    }


    public static getAssetUrls(): string[] {
        return ["background-1.png", "background-2.png"];
    }


    public changeForBossFight(): void {
        this.texture = Assets.get("background-2.png");
    }
}
