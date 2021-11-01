import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
//import "@babylonjs/loaders/glTF";
import 'babylonjs-loaders';
import * as earcut from 'earcut';
import { Mesh, Scene, Texture, Engine, AssetsManager, AbstractMesh, Vector3, SceneLoader } from "@babylonjs/core";

//This file is for importing and loading assets

export class assetController{
    meshes: Record<string, Mesh>;
    textures: Record<string, Texture>;
    assetsManager: AssetsManager;

    constructor(scene: Scene){
        this.assetsManager = new AssetsManager(scene);
    }

    async loadObject(name: string, objFile: string, texture: string, scene: Scene, engine: Engine, scaling? : Vector3 | null, position? : Vector3 | null){
        let balloon: AbstractMesh;
        let meshTask = this.assetsManager.addMeshTask(`${name} task`, '', '/assets/models/', objFile);

        let temp = await SceneLoader.ImportMeshAsync(null, '/assets/models/', 'airBalloon.obj', scene);

        let temp2 = temp.meshes[0];
        temp2.position = position;
        temp2.scaling = scaling;
        meshTask.onSuccess = (task) => {
            balloon = task.loadedMeshes[0];
            balloon.name = "HotAirBallonParent";
            for(let i = 0; i < task.loadedMeshes.length; i++){
                if(i != 0) task.loadedMeshes[i].parent = task.loadedMeshes[0];
                balloon.scaling = scaling == null ? balloon.scaling : scaling;
                balloon.position = position == null ? balloon.position : position;
            }
        }

        await this.assetsManager.loadAsync();
        return temp2;
    }
}