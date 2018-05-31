import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Engine, Scene, ArcRotateCamera, Vector3, MeshBuilder, Texture, StandardMaterial, Layer, Viewport, Tools, DeviceOrientationCamera, } from 'babylonjs';
import { AdvancedDynamicTexture } from 'babylonjs-gui';

import { UserDeviceOrientationCamera } from '../../classes/babylonjs/babylon.userdeviceOrientationCamera';
import { FreeCameraDeviceOrientationFilteredInput } from '../../classes/babylonjs/babylon.freeCameraDeviceOrientationFilteredInput';

/**
 * Generated class for the ArviewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-arview',
    templateUrl: 'arview.html',
})

export class ArviewPage {
    private _canvas: HTMLCanvasElement;
    private _engine: Engine;
    private _scene: Scene;
    private _camera: UserDeviceOrientationCamera;
    private _minimapCamera: ArcRotateCamera;
    private _advancedTexture: AdvancedDynamicTexture;

    constructor(public navCtrl: NavController, public navParams: NavParams) {
        this._canvas = <HTMLCanvasElement>document.getElementById("renderCanvas");
        this._engine = new Engine(this._canvas, true);
    }

    ionViewDidLoad() {
        this.createScene();
    }

    createScene(): void {
        // create a basic BJS Scene object
        this._scene = new Scene(this._engine);

        // clear background
        this._scene.clearColor = new BABYLON.Color4(0, 0, 0, 0.0000000000001);

        // create a FreeCamera, and set its position to (x:0, y:5, z:-10)
        this._camera = new UserDeviceOrientationCamera('DevOr_camera', new Vector3(0, 0, 0), this._scene);

        // remove all controls
        this._camera.inputs.clear()

        // camera controll
        this._camera.inputs.add(new FreeCameraDeviceOrientationFilteredInput(3));

        // set the FOV of the camera

        // target the camera to scene origin
        this._camera.setTarget(Vector3.Zero());

        // add camera to camera array
        this._scene.activeCameras.push(this._camera);

        // attach the camera to the canvas
        this._camera.attachControl(this._canvas, false);

        // set FOV MODE to allow fov matching
        this._camera.fovMode = BABYLON.Camera.FOVMODE_HORIZONTAL_FIXED;

        // set camera to receive pointers
        this._scene.cameraToUseForPointers = this._camera;

        // This targets the camera to scene origin
        this._camera.layerMask = 1;

        // display this camera over the whole available area
        this._camera.viewport = new Viewport(0, 0, 1.0, 1.0);
    }

    addGUI() {

        // UI layer
        this._advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI('UI');

        // assign GUI to camera via layermask
        this._advancedTexture.layer.layerMask = 1;

        // render above other objects
        this._advancedTexture.isForeground = true;

    }

    addMiniMap() {
        /*************MINIMAP *********************/
        var zoom = 400;

        // create minimap camera
        this._minimapCamera = new ArcRotateCamera('minimap_cam', 0, 0, 0, Vector3.Zero(), this._scene);

        // set position and zoom
        this._minimapCamera.position.y = zoom + 1;

        // add to cameras array
        this._scene.activeCameras.push(this._minimapCamera);

        // direction of camera
        this._minimapCamera.target = new Vector3(0, -1, 0)

        // set facing direction
        this._minimapCamera.viewport = new Viewport(0, 0, (2) / (this._canvas.width / 100) / 1.3, (2) / (this._canvas.height / 100) / 1.3);
        this._minimapCamera.layerMask = 2;
        this._minimapCamera.alpha = Tools.ToRadians(-90);
        this._minimapCamera.inputs.clear();

        // radar background plane
        var groundTexture = new Texture("assets/images/radar_north.png", this._scene);
        var groundMaterial = new StandardMaterial("texturePlane", this._scene);
        groundMaterial.diffuseTexture = groundTexture;
        groundMaterial.emissiveTexture = groundTexture;
        groundMaterial.diffuseTexture.hasAlpha = true;
        groundMaterial.backFaceCulling = true;

        // background for the radar
        var ring = MeshBuilder.CreateGround("radar_ring", {
            height: zoom - 5,
            width: zoom - 5,
            subdivisions: 4
        }, this._scene);
        ring.material = groundMaterial;
        ring.position = Vector3.Zero()
        ring.position.y = -0.5;
        ring.rotation.y = Tools.ToRadians(Number(0));
        ring.layerMask = 2;
        ring.isPickable = false;

        // radar ring
        // var planeTexture = new Texture("assets/images/radar_bg.png", this._scene);
        var planeMaterial = new StandardMaterial("texturePlane", this._scene);
        planeMaterial.emissiveTexture = new Texture("assets/images/radar_bg.png", this._scene);
        planeMaterial.backFaceCulling = true;
        planeMaterial.emissiveTexture.hasAlpha = true;

        var plane = MeshBuilder.CreateGround("radar_background", {
            height: zoom - 5,
            width: zoom - 5,
            subdivisions: 4
        }, this._scene);
        plane.material = planeMaterial;
        plane.position = Vector3.Zero();
        plane.position.y = -1;
        plane.layerMask = 2;
        plane.isPickable = false;

        /****** MiniMap Circle Cutout Mask */
        var cutlayer = new Layer('top', null, this._scene, true);
        var laytex = new Texture('assets/images/roundmask.png', this._scene);
        cutlayer.texture = laytex;
        cutlayer.alphaTest = true;

        cutlayer.onBeforeRender = () => {
            this._engine.setColorWrite(false);
            if (this._scene.activeCamera == this._minimapCamera) {
                this._engine.setDepthBuffer(true);
            }

            if (this._camera.rotationQuaternion != undefined) {
                var r = this._camera.rotationQuaternion.toEulerAngles()

                // Apply rotation to minimap
                this._minimapCamera.alpha = -r.y - Math.PI / 2;
            }
        }

        cutlayer.onAfterRender = () => {
            this._engine.setColorWrite(true);
        }
    }

    animate(): void {
        // run the render loop
        this._engine.runRenderLoop(() => {
            this._scene.render();
        });

        // the canvas/window resize event handler
        window.addEventListener('resize', () => {
            this._engine.resize();
        });
    }

    stop(): void {
        this._engine.stopRenderLoop(() => {
            this._scene.render();
        });
    }
}
