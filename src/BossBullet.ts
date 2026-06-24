import { Graphics } from "pixi.js";
import { appConfig } from "./appConfig";


export class BossBullet extends Graphics {
    private readonly onDisappear: () => void;
    private readonly onMove: () => void;


    public constructor(
        centerX: number,
        topY: number,
        onDisappear: () => void,
        onMove: () => void
    ) {
        super();
        this.onDisappear = onDisappear;
        this.onMove = onMove;

        const radius = 15;
        this
            .setFillStyle({
                color: 0xFF0000
            })
            .circle(radius, radius, radius)
            .fill();
        this.x = centerX - radius;
        this.y = topY;
    }


    public update(delay: number): void {
        const speed = 0.5;
        this.y += delay * speed;
        if (this.y >= appConfig.canvasHeight) {
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
