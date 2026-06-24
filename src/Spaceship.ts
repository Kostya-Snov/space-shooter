import type { DestroyOptions } from "pixi.js";
import { Assets, Sprite } from "pixi.js";
import { appConfig } from "./appConfig";


const enum PressedKey {
    None = "none",
    Left = "left",
    Right = "right"
}


export class Spaceship extends Sprite {
    private readonly onSpaceshipBulletCreate: (centerX: number, bottomY: number) => void;

    private readonly handleKeyDown: (event: KeyboardEvent) => void;
    private readonly handleKeyUp: (event: KeyboardEvent) => void;
    private pressedKey = PressedKey.None;


    public constructor(onSpaceshipBulletCreate: (centerX: number, bottomY: number) => void) {
        super(Assets.get("spaceship.png"));
        this.onSpaceshipBulletCreate = onSpaceshipBulletCreate;

        this.scale = 0.5;
        this.x = (appConfig.canvasWidth - this.width) / 2;
        this.y = appConfig.canvasHeight - this.height;

        this.handleKeyDown = (event: KeyboardEvent): void => {
            switch (event.key) {
                case "ArrowLeft":
                    this.pressedKey = PressedKey.Left;
                    break;

                case "ArrowRight":
                    this.pressedKey = PressedKey.Right;
                    break;

                case " ":
                    this.onSpaceshipBulletCreate(this.x + this.width / 2, this.y);
                    break;
            }
        };
        addEventListener("keydown", this.handleKeyDown);

        this.handleKeyUp = (event: KeyboardEvent): void => {
            const { key } = event;
            if (
                this.pressedKey === PressedKey.Left && key === "ArrowLeft"
                || this.pressedKey === PressedKey.Right && key === "ArrowRight"
            ) {
                this.pressedKey = PressedKey.None;
            }
        };
        addEventListener("keyup", this.handleKeyUp);
    }


    public static getAssetUrls(): string[] {
        return ["spaceship.png"];
    }


    public override destroy(options?: DestroyOptions): void {
        super.destroy(options);

        removeEventListener("keydown", this.handleKeyDown);
        removeEventListener("keyup", this.handleKeyUp);
    }


    public update(delta: number): void {
        const spaceshipSpeed = 0.3;

        switch (this.pressedKey) {
            case PressedKey.Left: {
                const offset = delta * spaceshipSpeed;
                this.x = Math.max(this.x - offset, 0);
                break;
            }

            case PressedKey.Right: {
                const offset = delta * spaceshipSpeed;
                this.x = Math.min(this.x + offset, appConfig.canvasWidth - this.width);
                break;
            }
        }
    }


    public disable(): void {
        this.pressedKey = PressedKey.None;
        removeEventListener("keydown", this.handleKeyDown);
        removeEventListener("keyup", this.handleKeyUp);
    }
}
