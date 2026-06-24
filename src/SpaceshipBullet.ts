import { Graphics } from "pixi.js";
import { appConfig } from "./appConfig";


export class SpaceshipBullet extends Graphics {
    private readonly onDisappear: () => void;


    public constructor(centerX: number, bottomY: number, onDisappear: () => void) {
        super();
        this.onDisappear = onDisappear;

        const { spaceshipBulletRadius } = appConfig;
        this
            .setFillStyle({
                color: appConfig.spaceshipBulletColor
            })
            .circle(spaceshipBulletRadius, spaceshipBulletRadius, spaceshipBulletRadius)
            .fill();
        this.x = centerX - spaceshipBulletRadius;
        this.y = bottomY - 2 * spaceshipBulletRadius;
    }


    public update(delay: number): void {
        this.y -= delay * appConfig.spaceshipBulletSpeed;
        if (this.y <= -this.height) {
            this.onDisappear();
            this.destroy({
                context: true
            });
        }
    }
}
