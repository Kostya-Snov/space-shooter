import { Container } from "pixi.js"
import { assert } from "./assert";
import { Asteroid } from "./Asteroid";
import { Background } from "./Background";
import { LossLabel } from "./LossLabel";
import { Spaceship } from "./Spaceship";
import { SpaceshipBullet } from "./SpaceshipBullet";
import { SpaceshipBulletCountLabel } from "./SpaceshipBulletCountLabel";
import { TimerLabel } from "./TimerLabel";
import { WinLabel } from "./WinLabel";


export class World extends Container {
    private readonly spaceship: Spaceship;
    private readonly spaceshipBullets: SpaceshipBullet[] = [];
    private readonly asteroids: Asteroid[] = [];
    private readonly spaceshipBulletCountLabel: SpaceshipBulletCountLabel;
    private readonly timerLabel: TimerLabel;

    private spaceshipBulletCount = 10;
    private spentTime = 0;
    private isFinished = false;


    public constructor() {
        super();

        this.addChild(new Background());

        const handleSpaceshipBulletCreate = (centerX: number, bottomY: number): void => {
            if (this.spaceshipBulletCount === 0) {
                return;
            }

            const handleDisappear = (): void => {
                this.removeSpaceshipBullet(spaceshipBullet);

                if (this.spaceshipBulletCount === 0 && this.spaceshipBullets.length === 0) {
                    this.handleFinish(false);
                }
            };

            const handleMove = (): void => {
                const spaceshipBulletBounds = spaceshipBullet.getBounds();
                const spaceshipBulletRadius = spaceshipBulletBounds.width / 2;
                const spaceshipBulletCenterX = spaceshipBulletBounds.minX + spaceshipBulletRadius;
                const spaceshipBulletCenterY = spaceshipBulletBounds.minY + spaceshipBulletRadius;

                for (const asteroid of this.asteroids) {
                    const asteroidBounds = asteroid.getBounds();
                    const asteroidRadius = asteroidBounds.width / 2;
                    const asteroidCenterX = asteroidBounds.minX + asteroidRadius;
                    const asteroidCenterY = asteroidBounds.minY + asteroidRadius;

                    const distance = Math.sqrt(
                        (spaceshipBulletCenterX - asteroidCenterX) ** 2
                        + (spaceshipBulletCenterY - asteroidCenterY) ** 2
                    );
                    if (distance > asteroidRadius + spaceshipBulletRadius) {
                        continue;
                    }

                    this.removeSpaceshipBullet(spaceshipBullet);
                    this.removeAsteroid(asteroid);

                    if (this.asteroids.length === 0) {
                        this.handleFinish(true);
                    } else if (
                        this.spaceshipBulletCount === 0
                        && this.spaceshipBullets.length === 0
                    ) {
                        this.handleFinish(false);
                    }

                    break;
                }
            }

            const spaceshipBullet = new SpaceshipBullet(
                centerX,
                bottomY,
                handleDisappear,
                handleMove
            );
            this.spaceshipBullets.push(spaceshipBullet);
            this.addChild(spaceshipBullet);

            --this.spaceshipBulletCount;
            this.spaceshipBulletCountLabel.change(this.spaceshipBulletCount);
        }
        this.spaceship = new Spaceship(handleSpaceshipBulletCreate);
        this.addChild(this.spaceship);

        this.spaceshipBulletCountLabel = new SpaceshipBulletCountLabel(this.spaceshipBulletCount);
        this.addChild(this.spaceshipBulletCountLabel);

        const asteroidInitialCount = 5;
        this.asteroids = Array.from(
            {
                length: asteroidInitialCount
            },
            () => new Asteroid()
        );
        this.addChild(...this.asteroids);

        const initialRemainingTime = 60 * 1000;
        this.timerLabel = new TimerLabel(initialRemainingTime);
        this.addChild(this.timerLabel);
    }


    public static getAssetUrls(): string[] {
        return [
            ...Background.getAssetUrls(),
            ...Spaceship.getAssetUrls(),
            ...Asteroid.getAssetUrls()
        ];
    }


    public update(delta: number): void {
        if (!this.isFinished) {
            this.spentTime += delta;
            const initialRemainingTime = 60 * 1000;
            if (this.spentTime >= initialRemainingTime) {
                this.spentTime = initialRemainingTime;
                this.handleFinish(false);
            }
            this.timerLabel.change(initialRemainingTime - this.spentTime)
        }

        this.spaceship.update(delta);
        for (const spaceshipBullet of this.spaceshipBullets) {
            spaceshipBullet.update(delta);
        }
        for (const asteroid of this.asteroids) {
            asteroid.update(delta);
        }
    }


    private removeSpaceshipBullet(spaceshipBullet: SpaceshipBullet): void {
        const index = this.spaceshipBullets.indexOf(spaceshipBullet);
        assert(index !== -1);
        this.spaceshipBullets.splice(index, 1);
        this.removeChild(spaceshipBullet);
        spaceshipBullet.cleanup();
    }


    private removeAsteroid(asteroid: Asteroid): void {
        const index = this.asteroids.indexOf(asteroid);
        assert(index !== -1);
        this.asteroids.splice(index, 1);
        this.removeChild(asteroid);
        asteroid.cleanup();
    }


    private handleFinish(isWin: boolean): void {
        this.addChild(isWin ? new WinLabel() : new LossLabel());
        this.spaceship.disable();
        this.isFinished = true;
    }
}
