import { Container } from "pixi.js"
import { assert } from "./assert";
import { Asteroid } from "./Asteroid";
import { Background } from "./Background";
import { Boss } from "./Boss";
import { BossBullet } from "./BossBullet";
import { circlesIntersect, rectanglesIntersect } from "./intersection";
import { LossLabel } from "./LossLabel";
import { Spaceship } from "./Spaceship";
import { SpaceshipBullet } from "./SpaceshipBullet";
import { SpaceshipBulletCountLabel } from "./SpaceshipBulletCountLabel";
import { TimerLabel } from "./TimerLabel";
import { WinLabel } from "./WinLabel";


export class World extends Container {
    private readonly background: Background;
    private readonly spaceship: Spaceship;
    private readonly spaceshipBullets: SpaceshipBullet[] = [];
    private asteroidsOrBoss: Asteroid[] | Boss;
    private readonly bossBullets: BossBullet[] = [];
    private readonly spaceshipBulletCountLabel: SpaceshipBulletCountLabel;
    private readonly timerLabel: TimerLabel;

    private spaceshipBulletCount = 10;
    private initialRemainingTime = 45 * 1000;
    private spentTime = 0;
    private isFinished = false;


    public constructor() {
        super();

        this.background = new Background();
        this.addChild(this.background);

        const handleSpaceshipBulletCreate = (centerX: number, bottomY: number) =>
            this.handleSpaceshipBulletCreate(centerX, bottomY);
        this.spaceship = new Spaceship(handleSpaceshipBulletCreate);
        this.addChild(this.spaceship);

        this.spaceshipBulletCountLabel = new SpaceshipBulletCountLabel(this.spaceshipBulletCount);
        this.addChild(this.spaceshipBulletCountLabel);

        const asteroidInitialCount = 5;
        const asteroids = this.asteroidsOrBoss = Array.from(
            {
                length: asteroidInitialCount
            },
            () => new Asteroid()
        );
        this.addChild(...asteroids);

        this.timerLabel = new TimerLabel(this.initialRemainingTime);
        this.addChild(this.timerLabel);
    }


    public static getAssetUrls(): string[] {
        return [
            ...Background.getAssetUrls(),
            ...Spaceship.getAssetUrls(),
            ...Asteroid.getAssetUrls(),
            ...Boss.getAssetUrls()
        ];
    }


    public update(delta: number): void {
        if (!this.isFinished) {
            this.spentTime += delta;
            if (this.spentTime >= this.initialRemainingTime) {
                this.spentTime = this.initialRemainingTime;
                this.handleFinish(false);
            }
            this.timerLabel.change(this.initialRemainingTime - this.spentTime)
        }

        this.spaceship.update(delta);
        for (const spaceshipBullet of this.spaceshipBullets) {
            spaceshipBullet.update(delta);
        }
        if (Array.isArray(this.asteroidsOrBoss)) {
            const asteroids = this.asteroidsOrBoss;
            for (const asteroid of asteroids) {
                asteroid.update(delta);
            }
        } else {
            const boss = this.asteroidsOrBoss;
            boss.update(delta);
        }
        for (const bossBullet of this.bossBullets) {
            bossBullet.update(delta);
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
        const asteroids = this.asteroidsOrBoss;
        assert(Array.isArray(asteroids));

        const index = asteroids.indexOf(asteroid);
        assert(index !== -1);
        asteroids.splice(index, 1);
        this.removeChild(asteroid);
        asteroid.cleanup();
    }


    private removeBossBullet(bossBullet: BossBullet): void {
        const index = this.bossBullets.indexOf(bossBullet);
        assert(index !== -1);
        this.bossBullets.splice(index, 1);
        this.removeChild(bossBullet);
        bossBullet.cleanup();
    }


    private handleFinish(isWin: boolean): void {
        this.addChild(isWin ? new WinLabel() : new LossLabel());
        this.spaceship.disable();
        this.isFinished = true;
    }


    private handleSpaceshipBulletCreate(centerX: number, bottomY: number): void {
        if (this.spaceshipBulletCount === 0) {
            return;
        }

        const handleDisappear = (): void => {
            this.removeSpaceshipBullet(spaceshipBullet);

            if (
                !this.isFinished
                && this.spaceshipBulletCount === 0
                && this.spaceshipBullets.length === 0
            ) {
                this.handleFinish(false);
            }
        };

        const handleMove = (): void => {
            if (Array.isArray(this.asteroidsOrBoss)) {
                const asteroids = this.asteroidsOrBoss;

                const spaceshipBulletBounds = spaceshipBullet.getBounds();
                const spaceshipBulletRadius = spaceshipBulletBounds.width / 2;
                const spaceshipBulletCircleInfo = {
                    centerX: spaceshipBulletBounds.minX + spaceshipBulletRadius,
                    centerY: spaceshipBulletBounds.minY + spaceshipBulletRadius,
                    radius: spaceshipBulletRadius
                }

                for (const asteroid of asteroids) {
                    const asteroidBounds = asteroid.getBounds();
                    const asteroidRadius = asteroidBounds.width / 2;
                    const asteroidCircleInfo = {
                        centerX: asteroidBounds.minX + asteroidRadius,
                        centerY: asteroidBounds.minY + asteroidRadius,
                        radius: asteroidRadius
                    };

                    if (!circlesIntersect(spaceshipBulletCircleInfo, asteroidCircleInfo)) {
                        continue;
                    }

                    this.removeSpaceshipBullet(spaceshipBullet);
                    this.removeAsteroid(asteroid);

                    if (asteroids.length === 0) {
                        const handleBossBulletCreate = (centerX: number, topY: number) =>
                            this.handleBossBulletCreate(centerX, topY);
                        const boss = this.asteroidsOrBoss = new Boss(handleBossBulletCreate);
                        this.addChild(boss);

                        this.background.changeForBossFight();

                        this.spaceshipBulletCount = 10;
                        this.spaceshipBulletCountLabel.change(this.spaceshipBulletCount);

                        this.initialRemainingTime = 60 * 1000;
                        this.spentTime = 0;
                        this.timerLabel.change(this.initialRemainingTime - this.spentTime);
                    } else if (
                        this.spaceshipBulletCount === 0
                        && this.spaceshipBullets.length === 0
                    ) {
                        this.handleFinish(false);
                    }

                    break;
                }
            } else {
                const boss = this.asteroidsOrBoss;

                const spaceshipBulletBounds = spaceshipBullet.getBounds();
                const bossBounds = boss.getBounds();
                if (!rectanglesIntersect(spaceshipBulletBounds, bossBounds)) {
                    return;
                }

                this.removeSpaceshipBullet(spaceshipBullet);
                if (boss.hit() && !this.isFinished) {
                    this.handleFinish(true);
                } else if (
                    !this.isFinished
                    && this.spaceshipBulletCount === 0
                    && this.spaceshipBullets.length === 0
                ) {
                    this.handleFinish(false);
                }
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


    private handleBossBulletCreate(centerX: number, topY: number): void {
        const handleDisappear = () => this.removeBossBullet(bossBullet);

        const handleMove = (): void => {
            const bossBulletBounds = bossBullet.getBounds();
            const bossBulletRadius = bossBulletBounds.width / 2;
            const bossBulletCircleInfo = {
                centerX: bossBulletBounds.minX + bossBulletRadius,
                centerY: bossBulletBounds.minY + bossBulletRadius,
                radius: bossBulletRadius
            }

            for (const spaceshipBullet of this.spaceshipBullets) {
                const spaceshipBulletBounds = spaceshipBullet.getBounds();
                const spaceshipBulletRadius = spaceshipBulletBounds.width / 2;
                const spaceshipBulletCircleInfo = {
                    centerX: spaceshipBulletBounds.minX + spaceshipBulletRadius,
                    centerY: spaceshipBulletBounds.minY + spaceshipBulletRadius,
                    radius: spaceshipBulletRadius
                }

                if (!circlesIntersect(bossBulletCircleInfo, spaceshipBulletCircleInfo)) {
                    continue;
                }

                this.removeBossBullet(bossBullet);
                this.removeSpaceshipBullet(spaceshipBullet);

                if (
                    !this.isFinished
                    && this.spaceshipBulletCount === 0
                    && this.spaceshipBullets.length === 0
                ) {
                    this.handleFinish(false);
                }

                return;
            }

            const spaceshipBounds = this.spaceship.getBounds();
            if (!rectanglesIntersect(bossBulletBounds, spaceshipBounds)) {
                return;
            }

            this.removeBossBullet(bossBullet);
            if (!this.isFinished) {
                this.handleFinish(false);
            }
        };

        const bossBullet = new BossBullet(centerX, topY, handleDisappear, handleMove);
        this.bossBullets.push(bossBullet);
        this.addChild(bossBullet);
    }
}
