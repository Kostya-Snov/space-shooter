import { Container } from "pixi.js"
import { appConfig } from "./appConfig";
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
            const handleDisappear = (): void => {
                const index = this.spaceshipBullets.indexOf(spaceshipBullet);
                assert(index !== -1);
                this.spaceshipBullets.splice(index, 1);

                this.removeChild(spaceshipBullet);
            };

            const spaceshipBullet = new SpaceshipBullet(centerX, bottomY, handleDisappear);
            this.spaceshipBullets.push(spaceshipBullet);
            this.addChild(spaceshipBullet);
        }
        this.spaceship = new Spaceship(handleSpaceshipBulletCreate);
        this.addChild(this.spaceship);

        this.asteroids = Array.from(
            {
                length: appConfig.asteroidCount
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
}
