import { Application, Assets } from "pixi.js"
import { World } from "./World";
import "./main.css";


const application = new Application();

await Promise.all([
    application.init({
        width: 1280,
        height: 720
    }),
    Assets.load(World.getAssetUrls())
]);

const world = new World();
application.stage.addChild(world);

document.body.appendChild(application.canvas);
