import { Graphics } from "pixi.js";


export class SpaceshipBullet extends Graphics {
    private readonly onDisappear: () => void;
    private readonly onMove: () => void;


    public constructor(
        centerX: number,
        bottomY: number,
        onDisappear: () => void,
        onMove: () => void
    ) {
        super();
        this.onDisappear = onDisappear;
        this.onMove = onMove;

        const spaceshipBulletRadius = 10;
        this
            .setFillStyle({
                color: 0x00FFFF
            })
            .circle(spaceshipBulletRadius, spaceshipBulletRadius, spaceshipBulletRadius)
            .fill();
        this.x = centerX - spaceshipBulletRadius;
        this.y = bottomY - 2 * spaceshipBulletRadius;
    }


    public update(delay: number): void {
        const spaceshipBulletSpeed = 0.4;
        this.y -= delay * spaceshipBulletSpeed;
        if (this.y <= -this.height) {
            this.onDisappear();
        } else {
            this.onMove();
        }
    }


    public cleanup(): void {
        this.destroy({
            context: true
        });
    }
}
