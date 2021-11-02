import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
//import "@babylonjs/loaders/glTF";
import 'babylonjs-loaders';
import * as earcut from 'earcut';
import {Animation, Mesh, Scene, Texture, Engine, AssetsManager, AbstractMesh, Tools, Vector3, SceneLoader, UniversalCamera } from "@babylonjs/core";

export class CameraManager{
    camera: UniversalCamera;
    scene: Scene;
    constructor(scene: Scene){
        this.scene = scene;
    }

    async init(canvas: HTMLCanvasElement, initialTarget: Vector3 = Vector3.Zero()){
        this.camera = new UniversalCamera("baloon camera", new Vector3(10, 10, 1), this.scene);
        this.camera.attachControl(canvas, true);
        this.camera.speed = this.camera.speed/10;
        this.camera.target = initialTarget;
    }

    setTarget(target: Vector3){
        this.camera.target = target;
    }
}