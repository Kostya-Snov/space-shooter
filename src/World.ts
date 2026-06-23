import { Container } from "pixi.js"
import { Background } from "./Background";


export class World extends Container {
    public constructor() {
        super();
        this.addChild(new Background());
    }


    public static getAssetUrls(): string[] {
        return [...Background.getAssetUrls()];
    }
}
