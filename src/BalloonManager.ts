import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
//import "@babylonjs/loaders/glTF";
import 'babylonjs-loaders';
import * as earcut from 'earcut';
import {Animation, Mesh, Scene, Texture, Engine, AssetsManager, AbstractMesh, Tools, Vector3, SceneLoader } from "@babylonjs/core";

//This file is for importing and loading assets

export class BalloonManager{
    scene: Scene;
    balloon: AbstractMesh;

    constructor(scene: Scene, engine: Engine){
        this.scene = scene;
    }

    async loadBalloonMesh(scene: Scene, engine: Engine){
        let balloon = await SceneLoader.ImportMeshAsync(null, '/assets/models/', 'airBalloon.obj', scene);
        let parentBalloon = balloon.meshes[0];
        for(let i = 1; i < balloon.meshes.length; i++){
            balloon.meshes[i].parent = parentBalloon;
        }

        parentBalloon.scaling = new Vector3(0.005, 0.005, 0.005);
        parentBalloon.position = new Vector3(0, 7, 0);
        
        this.balloon = parentBalloon;
        this.addMovement();
    }

    animateBalloon(degrees: number = 0, target: string){
        let anim = new Animation('hotAnimation', target, 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CONSTANT);
        let balloonKeys = [];
        balloonKeys.push({
            frame: 0, value: this.balloon.rotation.x
        },{
            frame: 60, value: Tools.ToRadians(degrees)
        });

        anim.setKeys(balloonKeys);
        this.balloon.animations = [];
        this.balloon.animations.push(anim);
        this.scene.beginAnimation(this.balloon, 0, 60, false);
    }

    addMovement(){
        let lastKey = '';
        document.addEventListener('keyup', (e)=>{
            this.scene.stopAnimation(this.balloon);
        })
        document.addEventListener('keydown', (e)=>{
            
            if (e.code === 'KeyQ'){
                this.balloon.position.y += 0.01
                lastKey = e.code;
            }
            if (e.code === 'KeyE'){
                this.balloon.position.y -= 0.01
                lastKey = e.code;
            }
            if (e.code === 'KeyW'){
                if (lastKey != e.code){
                    this.animateBalloon(22.5, 'rotation.x');
                }
                this.balloon.position.z += 0.01
                lastKey = e.code;
            }
            if (e.code === 'KeyS'){
                if (lastKey != e.code){
                    this.animateBalloon(-22.5, 'rotation.x');
                }
                this.balloon.position.z -= 0.01;
                lastKey = e.code;
            }
            if (e.code === 'KeyA'){
                if (lastKey != e.code){
                    this.animateBalloon(-22.5, 'rotation.z');
                }
                this.balloon.position.x += 0.01
                lastKey = e.code;
            }
            if (e.code === 'KeyD'){
                if (lastKey != e.code){
                    this.animateBalloon(22.5, 'rotation.z');
                }
                this.balloon.position.x -= 0.01
                lastKey = e.code;
            }
        })
    }
}