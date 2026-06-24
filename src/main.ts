import { Application, Assets } from "pixi.js"
import { appConfig } from "./appConfig";
import { World } from "./World";
import "./main.css";


const application = new Application();

await Promise.all([
    application.init({
        width: appConfig.canvasWidth,
        height: appConfig.canvasHeight
    }),
    (async () => {
        await Assets.init({
            basePath: `${import.meta.env.BASE_URL}/assets/`
        });

        await Assets.load(World.getAssetUrls());
    })()
]);

const world = new World();
application.stage.addChild(world);

application.ticker.add(t => world.update(t.deltaMS));

document.body.appendChild(application.canvas);
