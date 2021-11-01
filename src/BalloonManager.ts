import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
//import "@babylonjs/loaders/glTF";
import 'babylonjs-loaders';
import * as earcut from 'earcut';
import {Animation, Mesh, Scene, Texture, Engine, AssetsManager, AbstractMesh, Tools, Vector3 } from "@babylonjs/core";

//This file is for importing and loading assets

export class BalloonManager{
    meshes: Record<string, Mesh>;
    textures: Record<string, Texture>;
    assetsManager: AssetsManager;
    balloon: AbstractMesh;

    constructor(scene: Scene, engine: Engine){
        this.assetsManager = new AssetsManager(scene);
        this.loadBalloonMesh(scene, engine);
    }

    async loadBalloonMesh(scene: Scene, engine: Engine){
        let testAsset = new AssetsManager(scene);
        let object: AbstractMesh;
        let meshTask = testAsset.addMeshTask('baloon task', '', '/assets/models/', 'airBaloon.obj');

        meshTask.onSuccess = (task) => {
            object = task.loadedMeshes[0];
            object.name = "HotAirBallonParent";
            for(let i = 0; i < task.loadedMeshes.length; i++){
                if(i != 0) task.loadedMeshes[i].parent = task.loadedMeshes[0];
                object.scaling = new Vector3(.005, .005, .005);
                object.position = new Vector3(10, 5, 0);
            }
        }

        await this.assetsManager.loadAsync();
        this.balloon = object;
        //return object;
    }

    animateBalloon(scene: Scene){
        let anim = new Animation('hotAirBallon.movement.anim', 'rotation', 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CONSTANT);
        let balloonKeys = [];
        balloonKeys.push({
            frame: 0, value: new Vector3(0, 0, 0)
        },{
            frame: 60, value: new Vector3(0, Tools.ToRadians(22.5), 0)
        });

        anim.setKeys(balloonKeys);
        this.balloon.animations = [];
        this.balloon.animations.push(anim);
        scene.beginAnimation(this.balloon, 0, 60, false);
    }
}