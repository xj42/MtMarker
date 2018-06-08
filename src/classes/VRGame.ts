import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  MeshBuilder,
  Texture,Mesh,
  StandardMaterial,
  WebVRFreeCamera,
  Layer,
  Viewport,
  Tools,DeviceOrientationCamera,
  FreeCamera
} from "babylonjs";
import { AdvancedDynamicTexture } from "babylonjs-gui";
import { UserDeviceOrientationCamera } from "./babylonjs/UserDeviceOrientationCamera";
import { FreeCameraDeviceOrientationFilteredInput } from "./babylonjs/FreeCameraDeviceOrientationFilteredInput";
import { Device } from "@ionic-native/device";
import { AppModule } from "../app/app.module";
import { BabylonMarker } from "../classes/BabylonMarker";
import { Marker } from "../classes/Marker";

export class VRGame {
  private _canvas: HTMLCanvasElement;
  private _engine: Engine;
  private _scenes: Scene[] = [];
  private _camera;
  private _minimapCamera: ArcRotateCamera;
  private _advancedTexture: AdvancedDynamicTexture;
  private _device: Device;
  private _markers: BabylonMarker[] = [];

  constructor(canvasElement: string) {
    // constructor(canvasElement: string, private user: UserProvider, private gyro: any) {
    this._canvas = <HTMLCanvasElement>document.getElementById(canvasElement);
    this._engine = new Engine(this._canvas, true);
    this._device = AppModule.injector.get(Device);
  }

  createScene(): Scene {
    // create a basic BJS Scene object
    let _scene = new Scene(this._engine);

    // clear background
    // this._scene.clearColor = new BABYLON.Color4(0, 0, 0, 0.0000000000001);

    // create a FreeCamera, and set its position to (x:0, y:5, z:-10)

    //   this._camera =  new WebVRFreeCamera("camera1", new Vector3(0, 0, 0), _scene, { trackPosition: true });

	//   this._camera.deviceScaleFactor = 1;
	//   this._camera = new WebVRFreeCamera('DevOr_camera', new Vector3(0, 0, -10), _scene);
	  this._camera = new BABYLON.VRDeviceOrientationFreeCamera('DevOr_camera', new Vector3(0, 0, -10), _scene);

	  var light = new BABYLON.DirectionalLight("light", new BABYLON.Vector3(0, -0.5, 1.0), _scene);
	  light.position = new BABYLON.Vector3(0, 5, -2);
    // remove all controls
    // this._camera.inputs.clear();
	// _scene.activeCamera.beta += 0.8;
	 // Create simple sphere
	 var sphere = BABYLON.Mesh.CreateIcoSphere("sphere", {radius:0.2, flat:true, subdivisions: 1}, _scene);
	 sphere.position.y = 3;
	 sphere.material = new BABYLON.StandardMaterial("sphere material",_scene)

    // camera controll
    // this._camera.inputs.add(new FreeCameraDeviceOrientationFilteredInput(3));
    // var environment = _scene.createDefaultEnvironment({ enableGroundShadow: true, groundYBias: 1 });
	// environment.setMainColor(BABYLON.Color3.FromHexString("#74b9ff"))

	// var vrHelper = _scene.createDefaultVRExperience({createDeviceOrientationCamera:false});
	// vrHelper.enableTeleportation({floorMeshes: [environment.ground]});

    // this._camera.inputs.addMouse();

    // target the camera to scene origin
    this._camera.setTarget(Vector3.Zero());

    // add camera to camera array
    _scene.activeCameras.push(this._camera);

    // attach the camera to the canvas
    this._camera.attachControl(this._canvas, false);

    // set FOV MODE to allow fov matching
    this._camera.fovMode = BABYLON.Camera.FOVMODE_HORIZONTAL_FIXED;

    // set camera to receive pointers
    _scene.cameraToUseForPointers = this._camera;

    // This targets the camera to scene origin
    this._camera.layerMask = 1;

    // display this camera over the whole available area
    this._camera.viewport = new Viewport(0, 0, 1.0, 1.0);

    return _scene;
  }

  /**
   * Get a scene
   * @param sceneIndex
   */
  public getScene(sceneIndex: number): Scene {
    return this._scenes[sceneIndex];
  }

  /**
   * get the list of markers
   */
  public getMarkers(): BabylonMarker[] {
    return this._markers;
  }

  /**
   * Create the GUI texture
   */
  public addGUI(): void {
    this._advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI(
      "UI"
    );

    // assign GUI to camera via layermask
    this._advancedTexture.layer.layerMask = 1;

    // render above other objects
    this._advancedTexture.isForeground = true;
  }

  /**
   * Get the GUI texture
   */
  public getGUI(): AdvancedDynamicTexture {
    return this._advancedTexture;
  }

  /**
   * Add a minimap to the scene
   * @param _scene
   */
  addMiniMap(_scene: Scene): void {
    /*************MINIMAP *********************/
    var zoom = 400;

    // create minimap camera
    this._minimapCamera = new ArcRotateCamera(
      "minimap_cam",
      0,
      0,
      0,
      Vector3.Zero(),
      _scene
    );

    // set position and zoom
    this._minimapCamera.position.y = zoom + 1;

    // add to cameras array
    _scene.activeCameras.push(this._minimapCamera);

    // direction of camera
    this._minimapCamera.target = new Vector3(0, -1, 0);

    // set facing direction
    this._minimapCamera.viewport = new Viewport(
      0,
      0,
      2 / (this._canvas.width / 100) / 1.3,
      2 / (this._canvas.height / 100) / 1.3
    );
    this._minimapCamera.layerMask = 2;
    this._minimapCamera.alpha = Tools.ToRadians(-90);
    this._minimapCamera.inputs.clear();

    // radar background plane
    var groundTexture = new Texture("assets/imgs/radar_north.png", _scene);
    var groundMaterial = new StandardMaterial("texturePlane", _scene);
    groundMaterial.diffuseTexture = groundTexture;
    groundMaterial.emissiveTexture = groundTexture;
    groundMaterial.diffuseTexture.hasAlpha = true;
    groundMaterial.backFaceCulling = true;

    // background for the radar
    var ring = MeshBuilder.CreateGround(
      "radar_ring",
      {
        height: zoom - 5,
        width: zoom - 5,
        subdivisions: 4
      },
      _scene
    );
    ring.material = groundMaterial;
    ring.position = Vector3.Zero();
    ring.position.y = -0.5;
    ring.rotation.y = Tools.ToRadians(Number(0));
    ring.layerMask = 2;
    ring.isPickable = false;

    // radar ring
    // var planeTexture = new Texture("assets/images/radar_bg.png", this._scene);
    var planeMaterial = new StandardMaterial("texturePlane", _scene);
    planeMaterial.emissiveTexture = new Texture(
      "assets/imgs/radar_bg.png",
      _scene
    );
    planeMaterial.backFaceCulling = true;
    planeMaterial.emissiveTexture.hasAlpha = true;

    var plane = MeshBuilder.CreateGround(
      "radar_background",
      {
        height: zoom - 5,
        width: zoom - 5,
        subdivisions: 4
      },
      _scene
    );
    plane.material = planeMaterial;
    plane.position = Vector3.Zero();
    plane.position.y = -1;
    plane.layerMask = 2;
    plane.isPickable = false;

    /****** MiniMap Circle Cutout Mask */
    var cutlayer = new Layer("top", null, _scene, true);
    var laytex = new Texture("assets/imgs/roundmask.png", _scene);
    cutlayer.texture = laytex;
    cutlayer.alphaTest = true;

    cutlayer.onBeforeRender = () => {
      this._engine.setColorWrite(false);
      if (_scene.activeCamera == this._minimapCamera) {
        this._engine.setDepthBuffer(true);
      }

      if (this._camera.rotationQuaternion != undefined) {
        var r = this._camera.rotationQuaternion.toEulerAngles();

        // Apply rotation to minimap
        this._minimapCamera.alpha = -r.y - Math.PI / 2;
      }
    };

    cutlayer.onAfterRender = () => {
      this._engine.setColorWrite(true);
    };
  }

  /**
   * Add a scene to the game.
   * @param scene
   */
  addScene(scene: Scene): number {
    return this._scenes.push(scene);
  }

  /**
   * Add a list of Markers
   * @param mtns
   * @param scene
   */
  addMarkers(scene: Scene) {

	// Our built-in 'sphere' shape. Params: name, subdivs, size, scene
		  var rightBox = Mesh.CreateBox("sphere1", 1, scene);
		  rightBox.scaling.copyFromFloats(2, 1, 2);
		  var leftBox = Mesh.CreateBox("sphere1", 1, scene);
		  leftBox.scaling.copyFromFloats(2, 1, 2);

		  rightBox.material = new StandardMaterial('right', scene);
		  leftBox.material = new StandardMaterial('right', scene);
  }

  /**
   * Start a scene
   * @param sceneIndex
   */
  animateScene(sceneIndex: number): void {
    // run the render loop
    this._engine.runRenderLoop(() => {
      this._scenes[sceneIndex].render();
    });

    // the canvas/window resize event handler
    window.addEventListener("resize", () => {
      this._engine.resize();
    });
  }

  /**
   *
   * @param sceneIndex Stop a scene
   */
  stop(sceneIndex: number): void {
    this._engine.stopRenderLoop(() => {
      this._scenes[sceneIndex].render();
    });
  }
}
