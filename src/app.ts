import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, Mesh, MeshBuilder, Sound, Tools, StandardMaterial, Color3, Texture} from "@babylonjs/core";


class App {
    constructor() {
        let canvas = this.createCanvas();

        // initialize babylon scene and engine
        var engine = new Engine(canvas, true);
        var scene = new Scene(engine);

        var camera: ArcRotateCamera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, Vector3.Zero(), scene);
        camera.attachControl(canvas, true);
        var light1: HemisphericLight = new HemisphericLight("light1", new Vector3(1, 1, 0), scene);
        //var sphere: Mesh = MeshBuilder.CreateSphere("sphere", { diameter: 1 }, scene);
        //sphere.position.y = 0.5

        let box = MeshBuilder.CreateBox("box", {}, scene);
        //box.position = new Vector3(-2, 4.2, 0.1);
        box.position.y = 0.5;
        box.rotation.y = Tools.ToRadians(90);

        let boxMat = new StandardMaterial("boxMat", scene);
        boxMat.diffuseTexture = new Texture("https://www.babylonjs-playground.com/textures/floor.png", scene);
        box.material = boxMat;

        let roof = MeshBuilder.CreateCylinder("roof", {diameter: 1.3, height: 1.2, tessellation: 3});
        roof.scaling.x = 0.75;
        roof.rotation.z = Math.PI / 2;
        roof.position.y = 1.22;

        let roofMat = new StandardMaterial("roofMat", scene);
        roofMat.diffuseTexture = new Texture("https://assets.babylonjs.com/environments/roof.jpg", scene);
        roof.material = roofMat;

        // setInterval(()=>{
        //     box.rotation.z = Tools.ToRadians(Tools.ToDegrees(box.rotation.z) + 0.5)
        // }, 33)


        this.createButton(box);

        //adding ground
        let ground = MeshBuilder.CreateGround('ground', {width: 10, height: 10}, scene);
        let sound = new Sound("name", "/assets/music/bkgMusic.mp3", scene, null, {loop: true, autoplay: true, volume: 0.1});

        let groundMat = new StandardMaterial("groundMat", scene);
        groundMat.diffuseColor = new Color3(0,1,0);
        groundMat.backFaceCulling = false;
        ground.material = groundMat;


        
        this.addInspectorEventListener(scene)

        // run the main render loop
        engine.runRenderLoop(() => {
            scene.render();
        });
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

    createButton(box: Mesh) : void{
        let buttonXP = document.createElement("button");
        buttonXP.textContent = "Rotate X (+10)"
        let buttonXN = document.createElement("button");
        buttonXN.textContent = "Rotate X (-10)"
        let buttonYP = document.createElement("button");
        buttonYP.textContent = "Rotate Y (+10)"
        let buttonYN = document.createElement("button");
        buttonYN.textContent = "Rotate Y (-10)"
        let buttonZP = document.createElement("button");
        buttonZP.textContent = "Rotate Z (+10)"
        let buttonZN = document.createElement("button");
        buttonZN.textContent = "Rotate Z (-10)"

        document.body.appendChild(buttonXP);
        document.body.appendChild(buttonXN);
        document.body.appendChild(document.createElement('hr'));
        document.body.appendChild(buttonYP);
        document.body.appendChild(buttonYN);
        document.body.appendChild(document.createElement('hr'));
        document.body.appendChild(buttonZP);
        document.body.appendChild(buttonZN);


        buttonXP.addEventListener('click', () => {
            box.rotation.x += Tools.ToRadians(Tools.ToDegrees(box.rotation.x) + 10);
        });
        buttonXN.addEventListener('click', () => {
            box.rotation.x += Tools.ToRadians(Tools.ToDegrees(box.rotation.x) - 10);
        });
        buttonYP.addEventListener('click', () => {
            box.rotation.y += Tools.ToRadians(Tools.ToDegrees(box.rotation.y) + 10);
        });
        buttonYN.addEventListener('click', () => {
            box.rotation.y += Tools.ToRadians(Tools.ToDegrees(box.rotation.y) - 10);
        });
        buttonZP.addEventListener('click', () => {
            box.rotation.z += Tools.ToRadians(Tools.ToDegrees(box.rotation.z) + 10);
        });
        buttonZN.addEventListener('click', () => {
            box.rotation.z += Tools.ToRadians(Tools.ToDegrees(box.rotation.z) - 10);
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