import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
//import "@babylonjs/loaders/glTF";
import 'babylonjs-loaders';
import * as earcut from 'earcut';
import { assetController } from "./assetController";
import { AbstractMesh, Animation, Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, Mesh, MeshBuilder, Sound, Tools, StandardMaterial, Color3, Texture, Vector4, UniversalCamera, SceneLoader, AssetsManager} from "@babylonjs/core";

class App {
    assetController: assetController
    constructor() {
        let canvas = this.createCanvas();

        // initialize babylon scene and engine
        var engine = new Engine(canvas, true);
        var scene = new Scene(engine);

        this.assetController = new assetController(scene)
        this.init(engine, scene, canvas);
    }

    private async init(engine: Engine, scene: Scene, canvas: HTMLCanvasElement){
        
        let uniCam = new UniversalCamera("Universal Camera", new Vector3(28, 5, 1), scene);
        uniCam.target = Vector3.Zero();
        uniCam.attachControl(canvas, true);
        uniCam.speed = uniCam.speed/10

        var light1: HemisphericLight = new HemisphericLight("light1", new Vector3(1, 1, 0), scene);

        let ground = this.createGround(scene);
        this.createTown(scene);
        this.createCar(scene);
        let hotAirBalloon = await this.assetController.loadObject("baloon", "airBalloon.obj", '', scene, engine, new Vector3(.005, .005, .005), new Vector3(0, 5, 0));


        ////
        


        this.addInspectorEventListener(scene)
        // run the main render loop
        let lastKey = '';
        document.addEventListener('keydown', (e)=>{
            
            if (e.code === 'KeyQ'){
                hotAirBalloon.position.y += 0.01

            }
            if (e.code === 'KeyE'){
                hotAirBalloon.position.y -= 0.01
            }
            if (e.code === 'KeyW'){
                if (lastKey != e.code){
                    let anim = new Animation('hotAnimation', 'rotation.x', 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CONSTANT)
                    let baloonKeys = []
                    baloonKeys.push({
                        frame: 0, 
                        value: 0
                    },
                    {
                        frame: 60, 
                        value: Tools.ToRadians(45)
                    })
                    anim.setKeys(baloonKeys);
                    hotAirBalloon.animations = [];
                    hotAirBalloon.animations.push(anim);
                    scene.beginAnimation(hotAirBalloon, 0, 60, false);
                }
                hotAirBalloon.position.z += 0.01
                lastKey = e.code;

            }
            if (e.code === 'KeyS'){
                lastKey = e.code;
                hotAirBalloon.position.z -= 0.01
            }
            if (e.code === 'KeyA'){
                hotAirBalloon.position.x += 0.01
            }
            if (e.code === 'KeyD'){
                hotAirBalloon.position.x -= 0.01
            }
        })

        engine.runRenderLoop(() => {
            //hotAirBalloon.position.y = hotAirBalloon.position.y + 0.005
            uniCam.target = hotAirBalloon.position;
            scene.render();
        });
    }

    createCar(scene: Scene){
        //base
        const outline = [
            new Vector3(-0.3, 0, -0.1),
            new Vector3(0.2, 0, -0.1),
        ]

        //curved front
        for (let i = 0; i < 20; i++) {
            outline.push(new Vector3(0.2 * Math.cos(i * Math.PI / 40), 0, 0.2 * Math.sin(i * Math.PI / 40) - 0.1));
        }

        //top
        outline.push(new Vector3(0, 0, 0.1));
        outline.push(new Vector3(-0.3, 0, 0.1));

        //faceUV
        let carFaceUV = [];
        carFaceUV[0] = new Vector4(0, 0.5, 0.38, 1);
        carFaceUV[1] = new Vector4(0, 0, 1, 0.5);
        carFaceUV[2] = new Vector4(0.38, 1, 0, 0.5);

        let car = MeshBuilder.ExtrudePolygon("car", {shape: outline, faceUV: carFaceUV, depth: 0.2}, scene, earcut)

        //adding material to car
        let carMat = new StandardMaterial("carMat", scene);
        carMat.diffuseTexture = new Texture("/assets/textures/car.webp", scene);

        car.material = carMat;

        //faceUV for wheel
        let wheelFaceUV = [];
        wheelFaceUV[0] = new Vector4(0,0,1,1);
        wheelFaceUV[1] = new Vector4(0,0.5,0,0.5);
        wheelFaceUV[2] = new Vector4(0,0,1,1);

        const wheelRB = MeshBuilder.CreateCylinder("wheelRB", {diameter: 0.125, height: 0.05, faceUV: wheelFaceUV}, scene)
        wheelRB.parent = car;
        wheelRB.position.z = -0.1;
        wheelRB.position.x = -0.2;
        wheelRB.position.y = 0.035;

        const wheelRF = wheelRB.clone("wheelRF");
        wheelRF.position.x = 0.1;

        const wheelLB = wheelRB.clone("wheelLB");
        wheelLB.position.y = -0.2 - 0.035;

        const wheelLF = wheelRF.clone("wheelLF");
        wheelLF.position.y = -0.2 - 0.035;

        //adding material to wheels
        let wheelMat = new StandardMaterial("wheelMat", scene);
        wheelMat.diffuseTexture = new Texture("/assets/textures/wheel.webp", scene); 

        wheelRB.material = wheelMat;
        wheelRF.material = wheelMat;
        wheelLF.material = wheelMat;
        wheelLB.material = wheelMat;

        //rotating car
        car.rotation.x = 3*Math.PI/2 ;
        car.position.y = 0.2

        //animating wheels
        this.animateWheel(wheelRB, scene);
        this.animateWheel(wheelRF, scene);
        this.animateWheel(wheelLB, scene);
        this.animateWheel(wheelLF, scene);
        this.animateCar(car, scene);

    }
    animateCar(car: Mesh, scene: Scene){
        let animCar = new Animation('carAnimation', 'position.x', 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);
        let carKeys = []
        carKeys.push({
            frame: 0, value: -4
        },
        {
            frame: 150, value: 4
        },
        {
            frame: 210, value: 4
        });

        animCar.setKeys(carKeys);
        car.animations = []
        car.animations.push(animCar);

        scene.beginAnimation(car, 0, 210, true);
    }
    animateWheel(wheel: Mesh, scene: Scene){
        let animWheel = new Animation("wheelAnimation", "rotation.y", 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);
        let wheelKeys = [];
        wheelKeys.push({
            frame: 0,
            value: 0
        },
        {
            frame: 30,
            value: 2 * Math.PI
        });

        animWheel.setKeys(wheelKeys);

        wheel.animations = [];
        wheel.animations.push(animWheel);

        scene.beginAnimation(wheel,0,30,true);
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