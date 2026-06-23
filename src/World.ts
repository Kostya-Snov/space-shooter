import { Container } from "pixi.js"
import { Background } from "./Background";
import { Spaceship } from "./Spaceship";


export class World extends Container {
    private readonly spaceship: Spaceship;


    public constructor() {
        super();

        this.addChild(new Background());

        this.spaceship = new Spaceship();
        this.addChild(this.spaceship);
    }


    public static getAssetUrls(): string[] {
        return [...Background.getAssetUrls(), ...Spaceship.getAssetUrls()];
    }


    public update(delta: number): void {
        this.spaceship.update(delta);
    }
}
