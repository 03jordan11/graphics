import { Scene, Sound } from "@babylonjs/core";

export class SoundManager{
    scene: Scene
    sound: Sound

    constructor(scene: Scene){
        this.scene = scene
    }

    async init(){
        this.sound =  new Sound("bkg music", "/assets/music/bkgMusic.mp3", this.scene, null, {loop: true, autoplay: true, volume: 0.1});
    }
}