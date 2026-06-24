import { Text } from "pixi.js";
import { appConfig } from "./appConfig";


export class SpaceshipBulletCountLabel extends Text {
    private readonly initialSpaceshipBulletCount: number;


    public constructor(initialSpaceshipBulletCount: number) {
        super({
            text: "-",
            style: {
                fontFamily: "Arial",
                fontSize: 24,
                fill: 0xFF00FF,
                align: "center"
            }
        });
        this.initialSpaceshipBulletCount = initialSpaceshipBulletCount;

        this.change(initialSpaceshipBulletCount);

        const padding = 10;
        this.x = padding;
        this.y = appConfig.canvasHeight - this.height - padding;
    }


    public change(spaceshipBulletCount: number): void {
        this.text = `${spaceshipBulletCount}/${this.initialSpaceshipBulletCount}`;
    }
}
