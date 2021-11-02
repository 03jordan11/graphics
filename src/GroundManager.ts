import { Mesh, Scene, MeshBuilder, StandardMaterial, Color3 } from "@babylonjs/core";

export class GroundManager{
    scene: Scene;
    ground: Mesh;

    constructor(scene: Scene){
        this.scene = scene;
    }

    async init(){
        this.ground = MeshBuilder.CreateGround('ground', {width: 100, height: 100}, this.scene);
        let groundMat = new StandardMaterial("groundMat", this.scene);
        groundMat.diffuseColor = new Color3(0,1,0);
        groundMat.backFaceCulling = false;
        this.ground.material = groundMat;
    }
}