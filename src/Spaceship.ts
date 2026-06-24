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
    private readonly removeListenerFunctions: (() => void)[];
    private pressedKey = PressedKey.None;


    public constructor(onSpaceshipBulletCreate: (centerX: number, bottomY: number) => void) {
        super(Assets.get("/assets/spaceship.png"));
        this.onSpaceshipBulletCreate = onSpaceshipBulletCreate;

        this.removeListenerFunctions = [];

        this.scale.set(appConfig.spaceshipScale);
        this.x = (appConfig.canvasWidth - this.width) / 2;
        this.y = appConfig.canvasHeight - this.height;

        const handleKeyDown = (event: KeyboardEvent): void => {
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
        addEventListener("keydown", handleKeyDown);
        this.removeListenerFunctions.push(() => removeEventListener("keydown", handleKeyDown));

        const handleKeyUp = (event: KeyboardEvent): void => {
            const { key } = event;
            if (
                this.pressedKey === PressedKey.Left && key === "ArrowLeft"
                || this.pressedKey === PressedKey.Right && key === "ArrowRight"
            ) {
                this.pressedKey = PressedKey.None;
            }
        };
        addEventListener("keyup", handleKeyUp);
        this.removeListenerFunctions.push(() => removeEventListener("keyup", handleKeyUp))
    }


    public static getAssetUrls(): string[] {
        return ["/assets/spaceship.png"];
    }


    public override destroy(options?: DestroyOptions): void {
        super.destroy(options);

        for (const removeListener of this.removeListenerFunctions) {
            removeListener();
        }
    }


    public update(delta: number): void {
        switch (this.pressedKey) {
            case PressedKey.Left: {
                const offset = delta * appConfig.spaceshipSpeed;
                this.x = Math.max(this.x - offset, 0);
                break;
            }

            case PressedKey.Right: {
                const offset = delta * appConfig.spaceshipSpeed;
                this.x = Math.min(this.x + offset, appConfig.canvasWidth - this.width);
                break;
            }
        }
    }
}
