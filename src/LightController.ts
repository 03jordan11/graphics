import { HemisphericLight, Scene, Vector3 } from "@babylonjs/core";

export class LightManager{
    mainLight: HemisphericLight;
    scene: Scene;

    constructor(scene: Scene){
        this.scene = scene;
    }

    async init(direction: Vector3 = new Vector3(1,1,0)){
        this.mainLight = new HemisphericLight('main light', direction, this.scene);
    }
}