import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, Mesh, MeshBuilder, Sound, Tools, StandardMaterial, Color3, Texture, Vector4} from "@babylonjs/core";


class App {
    constructor() {
        let canvas = this.createCanvas();

        // initialize babylon scene and engine
        var engine = new Engine(canvas, true);
        var scene = new Scene(engine);

        var camera: ArcRotateCamera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, Vector3.Zero(), scene);
        camera.attachControl(canvas, true);
        var light1: HemisphericLight = new HemisphericLight("light1", new Vector3(1, 1, 0), scene);

        let ground = this.createGround(scene);
        this.createTown(scene);

        this.addInspectorEventListener(scene)

        // run the main render loop
        engine.runRenderLoop(() => {
            scene.render();
        });
    }

    createTown(scene: Scene) {

        const detached_house = this.createHouse(1, scene);
        detached_house.rotation.y = -Math.PI / 16;
        detached_house.position.x = -6.8;
        detached_house.position.z = 2.5;

        const semi_house = this.createHouse(2, scene);
        semi_house .rotation.y = -Math.PI / 16;
        semi_house.position.x = -4.5;
        semi_house.position.z = 3;

        const places = []; //each entry is an array [house type, rotation, x, z]
        places.push([1, -Math.PI / 16, -6.8, 2.5 ]);
        places.push([2, -Math.PI / 16, -4.5, 3 ]);
        places.push([2, -Math.PI / 16, -1.5, 4 ]);
        places.push([2, -Math.PI / 3, 1.5, 6 ]);
        places.push([2, 15 * Math.PI / 16, -6.4, -1.5 ]);
        places.push([1, 15 * Math.PI / 16, -4.1, -1 ]);
        places.push([2, 15 * Math.PI / 16, -2.1, -0.5 ]);
        places.push([1, 5 * Math.PI / 4, 0, -1 ]);
        places.push([1, Math.PI + Math.PI / 2.5, 0.5, -3 ]);
        places.push([2, Math.PI + Math.PI / 2.1, 0.75, -5 ]);
        places.push([1, Math.PI + Math.PI / 2.25, 0.75, -7 ]);
        places.push([2, Math.PI / 1.9, 4.75, -1 ]);
        places.push([1, Math.PI / 1.95, 4.5, -3 ]);
        places.push([2, Math.PI / 1.9, 4.75, -5 ]);
        places.push([1, Math.PI / 1.9, 4.75, -7 ]);
        places.push([2, -Math.PI / 3, 5.25, 2 ]);
        places.push([1, -Math.PI / 3, 6, 4 ]);

        let houses = [];
        for (let i = 0; i < places.length; i++){
            if(places[i][0] == 1){
                houses[i] = detached_house.createInstance("house" + i);
            }
            else{
                houses[i] = semi_house.createInstance("house" + i);
            }
            houses[i].rotation.y = places[i][1];
            houses[i].position = new Vector3(places[i][2], houses[i].position.y, places[i][3]);
        }
    }
    createGround(scene: Scene) : Mesh{
        let ground = MeshBuilder.CreateGround('ground', {width: 100, height: 100}, scene);
        let sound = new Sound("name", "/assets/music/bkgMusic.mp3", scene, null, {loop: true, autoplay: true, volume: 0.1});

        let groundMat = new StandardMaterial("groundMat", scene);
        groundMat.diffuseColor = new Color3(0,1,0);
        groundMat.backFaceCulling = false;
        ground.material = groundMat;

        return ground
    }
    createHouse(width: number, scene : Scene) : Mesh{
        let box = this.buildBox(width, scene)
        let roof = this.buildRoof(width, scene);
        let house = Mesh.MergeMeshes([box, roof], true, false, null, false, true);
        
        return house;
    }
    buildBox(width: number, scene: Scene) : Mesh{
        let faceUV = []
        if(width == 2){
            faceUV[0] = new Vector4(0.6, 0.0, 1.0, 1.0);
            faceUV[1] = new Vector4(0.0, 0.0, 0.4, 1.0);
            faceUV[2] = new Vector4(0.4, 0.0, 0.6, 1.0);
            faceUV[3] = new Vector4(0.4, 0.0, 0.6, 1.0);
        }
        else{
            faceUV[0] = new Vector4(0.5, 0.0, 0.75, 1.0);
            faceUV[1] = new Vector4(0.0, 0.0, 0.25, 1.0);
            faceUV[2] = new Vector4(0.25, 0.0, 0.25, 1.0);
            faceUV[3] = new Vector4(0.75, 0.0, 1.0, 1.0);
        }

        let box = MeshBuilder.CreateBox("box", {width: width, faceUV: faceUV, wrap: true}, scene);
        //box.position = new Vector3(-2, 4.2, 0.1);
        box.position.y = 0.5;

        let boxMat = new StandardMaterial("boxMat", scene);
        if (width == 2){
            boxMat.diffuseTexture = new Texture("https://assets.babylonjs.com/environments/semihouse.png", scene);
        }
        else{
            boxMat.diffuseTexture = new Texture("https://assets.babylonjs.com/environments/cubehouse.png", scene);
        }
        box.material = boxMat;
        return box;
    }
    buildRoof(width: number, scene: Scene) : Mesh{
        let roof = MeshBuilder.CreateCylinder("roof", {diameter: 1.3, height: 1.2, tessellation: 3});
        
        roof.scaling = new Vector3(0.75, width, 1);

        roof.rotation.z = Math.PI / 2;
        roof.position.y = 1.22;

        let roofMat = new StandardMaterial("roofMat", scene);
        roofMat.diffuseTexture = new Texture("https://assets.babylonjs.com/environments/roof.jpg", scene);
        roof.material = roofMat;
        return roof;
    }
    addInspectorEventListener(scene : Scene){
        // hide/show the Inspector
        window.addEventListener("keydown", (ev) => {
            // Shift+Ctrl+Alt+I
            if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.keyCode === 73) {
                if (scene.debugLayer.isVisible()) {
                    scene.debugLayer.hide();
                } else {
                    scene.debugLayer.show();
                }
            }
        });
    }
    createCanvas() : HTMLCanvasElement{
        let canvas = document.createElement("canvas");
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.id = "gameCanvas";
        document.body.appendChild(canvas);

        return canvas;
    }


}
new App();