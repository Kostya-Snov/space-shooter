import { Assets, Sprite } from "pixi.js";


export class Background extends Sprite {
    public constructor() {
        super(Assets.get("/assets/background-1.png"));
    }


    public static getAssetUrls(): string[] {
        return ["/assets/background-1.png", "/assets/background-2.png"];
    }


    public changeForBossFight(): void {
        this.texture = Assets.get("/assets/background-2.png");
    }
}
