import { PVector } from "./script/PVector";
import { ParticleSystem } from "./ParticleSystem";
import { Config } from "./Config";
import { settings } from "./Config";
import * as PIXI from "pixi.js";

export let config = settings;

let atomApi:any = (<any>window).atom;
let body = document.body;

let particleSystem: ParticleSystem;
let conf: Config;

let app:PIXI.Application;

export function activate(state:any) {
    conf = new Config();
    conf.setData(atomApi.config);
    let listenerCreator = (countMultiple:number, sizeMultiple:number) => (ev: MouseEvent) => {
        particleSystem.originPosition.x = ev.clientX;
        particleSystem.originPosition.y = ev.clientY;
        particleSystem.emitWithMultiple(conf,countMultiple,sizeMultiple);
    }
    body.onmousemove = listenerCreator(1,1);
    body.onmousewheel = listenerCreator(1,1);
    body.onmousedown = listenerCreator(conf.clickCountMultiple, conf.clickSizeMultiple);
    body.onmouseup = listenerCreator(conf.clickCountMultiple, conf.clickSizeMultiple);

    app = new PIXI.Application({
        width: body.clientWidth,
        height: body.clientHeight,
        antialias: true,
        transparent: true,
        resolution: 1
    });
    app.view.classList.add('pixi-view');
    body.appendChild(app.view);
    particleSystem = new ParticleSystem(app.stage, new PVector(0, 0));
    app.ticker.add(run);
}

export function run() {
    app.renderer.resize(body.clientWidth, body.clientHeight);
    particleSystem.applyForce(conf.wind);
    particleSystem.run();
}

export function deactivate() {
    app.destroy();
}

export function serialize() {
    return {};
}
