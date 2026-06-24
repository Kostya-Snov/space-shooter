import { Container } from "pixi.js"
import { assert } from "./assert";
import { Asteroid } from "./Asteroid";
import { Background } from "./Background";
import { Spaceship } from "./Spaceship";
import { SpaceshipBullet } from "./SpaceshipBullet";


export class World extends Container {
    private readonly spaceship: Spaceship;
    private readonly spaceshipBullets: SpaceshipBullet[] = [];
    private readonly asteroids: Asteroid[] = [];


    public constructor() {
        super();

        this.addChild(new Background());

        const handleSpaceshipBulletCreate = (centerX: number, bottomY: number): void => {
            const handleDisappear = () => this.removeSpaceshipBullet(spaceshipBullet);

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
        }
        this.spaceship = new Spaceship(handleSpaceshipBulletCreate);
        this.addChild(this.spaceship);

        const asteroidInitialCount = 5;
        this.asteroids = Array.from(
            {
                length: asteroidInitialCount
            },
            () => new Asteroid()
        );
        this.addChild(...this.asteroids);
    }


    public static getAssetUrls(): string[] {
        return [
            ...Background.getAssetUrls(),
            ...Spaceship.getAssetUrls(),
            ...Asteroid.getAssetUrls()
        ];
    }


    public update(delta: number): void {
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
}
