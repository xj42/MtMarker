import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  MeshBuilder,
  Texture,
  Mesh,
  StandardMaterial,
  Layer,
  VideoDome,
  Viewport,
  Tools,
  VRDeviceOrientationFreeCamera,
  FreeCamera
} from "babylonjs";
import { AdvancedDynamicTexture } from "babylonjs-gui";
import { Device } from "@ionic-native/device";
import { AppModule } from "../app/app.module";
import { BabylonMarker } from "../classes/BabylonMarker";
import { Marker } from "../classes/Marker";

export class VDome {
  private _canvas: HTMLCanvasElement;
  private _engine: Engine;
  private _scenes: Scene[] = [];
  private _camera;
  private _dome: VideoDome;
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

    //   this._camera =  new WebVRFreeCamera("camera1", new Vector3(0, 0, 0), _scene, { trackPosition: true });

    this._camera = new VRDeviceOrientationFreeCamera(
      "DevOr_camera",
      new Vector3(0, 0, -10),
      _scene
    );

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
    console.log("here");
    // Our built-in 'sphere' shape. Params: name, subdivs, size, scene
    var rightBox = Mesh.CreateBox("sphere1", 0.1, scene);
    rightBox.scaling.copyFromFloats(2, 1, 2);
    var leftBox = Mesh.CreateBox("sphere1", 0.1, scene);
    leftBox.scaling.copyFromFloats(2, 1, 2);

    rightBox.material = new StandardMaterial("right", scene);
    leftBox.material = new StandardMaterial("right", scene);

    // for (var i = 0; i < mtns.length; ++i) {
    //   this._markers.push(new BabylonMarker(mtns[i], scene));
    // }
  }

  videoDome(scene: Scene) {
    this._dome = new VideoDome(
      "testdome",
      "https://yoda.blob.core.windows.net/videos/uptale360.mp4",
      {
		resolution: 8,
		autoPlay:true
      },
      scene
    );
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
