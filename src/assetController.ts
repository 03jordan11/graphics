import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
//import "@babylonjs/loaders/glTF";
import 'babylonjs-loaders';
import * as earcut from 'earcut';
import { Mesh, Scene, Texture, Engine, AssetsManager, AbstractMesh, Vector3 } from "@babylonjs/core";

//This file is for importing and loading assets

export class assetController{
    meshes: Record<string, Mesh>;
    textures: Record<string, Texture>;
    assetsManager: AssetsManager;

    constructor(scene: Scene){
        this.assetsManager = new AssetsManager(scene);
    }

    async loadObject(name: string, objFile: string, texture: string, scene: Scene, engine: Engine, scaling? : Vector3 | null, position? : Vector3 | null){
        let object: AbstractMesh;
        let meshTask = this.assetsManager.addMeshTask(`${name} task`, '', '/assets/models/', objFile);

        meshTask.onSuccess = (task) => {
            object = task.loadedMeshes[0];
            object.name = "HotAirBallonParent";
            for(let i = 0; i < task.loadedMeshes.length; i++){
                if(i != 0) task.loadedMeshes[i].parent = task.loadedMeshes[0];
                object.scaling = scaling == null ? object.scaling : scaling;
                object.position = position == null ? object.position : position;
            }
        }

        await this.assetsManager.loadAsync();
        return object;
    }
}