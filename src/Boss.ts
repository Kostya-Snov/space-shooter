import { Assets, Container, Graphics, Sprite } from "pixi.js";
import { appConfig } from "./appConfig";
import { assert } from "./assert";
import { getRandomNumber } from "./getRandomNumber";


const enum Mode {
    Standing = "standing",
    MovingLeft = "moving-left",
    MovingRight = "moving-right"
}

const getInitialMode = (): Mode => {
    switch (Math.floor(getRandomNumber(0, 3))) {
        case 0:
            return Mode.Standing;
        case 1:
            return Mode.MovingLeft;
        case 2:
        case 3:
            return Mode.MovingRight;
        default:
            assert(false);
    }
}


const getShotRemainingTime = () => getRandomNumber(1, 3) * 1000;


const initialHealthPointCount = 4;


export class Boss extends Container {
    private readonly onBossBulletCreate: (centerX: number, topY: number) => void;

    private readonly healthPointBar: Graphics;

    private healthPointCount = initialHealthPointCount;
    private mode = getInitialMode();
    private shotRemainingTime = getShotRemainingTime();


    public constructor(onBossBulletCreate: (centerX: number, topY: number) => void) {
        super();
        this.onBossBulletCreate = onBossBulletCreate;

        const sprite = new Sprite(Assets.get("/assets/boss.png"));
        sprite.anchor = 0.5;
        sprite.scale = 0.25;
        sprite.rotation = Math.PI;
        sprite.x = sprite.width / 2;
        sprite.y = 30 + sprite.height / 2;
        this.addChild(sprite);

        this.healthPointBar = new Graphics();
        this.redrawHealthPointBar();
        this.addChild(this.healthPointBar);

        this.x = (appConfig.canvasWidth - this.width) / 2;
        this.y = 10;
    }


    public static getAssetUrls(): string[] {
        return ["/assets/boss.png"];
    }


    public update(delta: number): void {
        if (this.healthPointCount === 0) {
            return;
        }

        this.shotRemainingTime -= delta;
        if (this.shotRemainingTime <= 0) {
            this.shotRemainingTime = getShotRemainingTime();
            this.onBossBulletCreate(this.x + this.width / 2, this.y + this.height);
        }

        const speed = 0.5;
        switch (this.mode) {
            case Mode.MovingLeft:
                this.x -= delta * speed;
                if (this.x <= 0) {
                    this.x = 0;
                    this.mode = Mode.MovingRight;
                }
                break;

            case Mode.MovingRight:
                this.x += delta * speed;
                const maxX = appConfig.canvasWidth - this.width;
                if (this.x >= maxX) {
                    this.x = maxX;
                    this.mode = Mode.MovingLeft;
                }
                break;
        }

        this.mode = (() => {
            switch (Math.floor(getRandomNumber(0, 100))) {
                case 0:
                    return Mode.Standing;
                case 1:
                    return Mode.MovingLeft;
                case 2:
                    return Mode.MovingRight;
                default:
                    return this.mode;
            }
        })();
    }


    public hit(): boolean {
        if (this.healthPointCount === 0) {
            return false;
        }

        --this.healthPointCount;
        this.redrawHealthPointBar();
        return this.healthPointCount === 0;
    }


    private redrawHealthPointBar(): void {
        this.healthPointBar.clear();

        const padding = 2;
        this.healthPointBar
            .setFillStyle({
                color: 0x000000
            })
            .roundRect(0, 0, this.width, 20, 5)
            .fill()
            .setFillStyle({
                color: 0xC32E30
            })
            .roundRect(
                padding,
                padding,
                (this.width - 2 * padding) * this.healthPointCount / initialHealthPointCount,
                20 - 2 * padding,
                5
            )
            .fill();
    }
}
