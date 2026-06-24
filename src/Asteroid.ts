import { Assets, Sprite } from "pixi.js";
import { appConfig } from "./appConfig";
import { getRandomNumber } from "./getRandomNumber";


const enum Direction {
    Left = "left",
    Right = "right"
}


export class Asteroid extends Sprite {
    private readonly speed
        = getRandomNumber(appConfig.asteroidMinSpeed, appConfig.asteroidMaxSpeed);
    private direction = getRandomNumber(0, 2) < 1 ? Direction.Left : Direction.Right;


    public constructor() {
        super(Assets.get("/assets/asteroid.png"));

        this.anchor = 0.5;
        this.scale = appConfig.asteroidScale;
        this.rotation = getRandomNumber(0, 2 * Math.PI);
        const { width, height } = this.getBounds();
        this.x = getRandomNumber(width / 2, appConfig.canvasWidth - width / 2);
        this.y = height / 2;
    }


    public static getAssetUrls(): string[] {
        return ["/assets/asteroid.png"];
    }


    public update(delta: number): void {
        switch (this.direction) {
            case Direction.Left: {
                const { width } = this.getBounds();
                this.x -= delta * this.speed;
                const minX = width / 2;
                if (this.x <= minX) {
                    this.x = minX;
                    this.direction = Direction.Right;
                }
                break;
            }

            case Direction.Right: {
                const { width } = this.getBounds();
                this.x += delta * this.speed;
                const maxX = appConfig.canvasWidth - width / 2;
                if (this.x >= maxX) {
                    this.x = maxX;
                    this.direction = Direction.Left;
                }
                break;
            }
        }
    }
}
