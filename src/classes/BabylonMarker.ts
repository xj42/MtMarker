import { Mesh, Scene, Vector3, StandardMaterial, MeshBuilder } from "babylonjs";
import { Button, AdvancedDynamicTexture } from "babylonjs-gui";
import { Marker } from "../classes/Marker";
import { ConfigProvider } from "../providers/config/config";
import { AppModule } from "../app/app.module";

export class BabylonMarker {
  private _mesh: Mesh;
  private _material: StandardMaterial;
  private _GUIbutton: Button;
  private _config: ConfigProvider;

  constructor(private _marker: Marker, private _scene: Scene) {
    this._config = AppModule.injector.get(ConfigProvider);
    this._mesh = MeshBuilder.CreateSphere(
      "sphere",
      { diameter: 1 },
      this._scene
    );

    this._mesh.position = Vector3.Zero();

    /**
     * Material
     */
    this._material = new StandardMaterial("markerMaterial", this._scene);
    this._material.emissiveColor = BABYLON.Color3.White();
    this._material.freeze();

    this._mesh.material = this._material;
    this._mesh.layerMask = 1; // minimap camera
    this._mesh.isPickable = false;
  }

  /**
   * Add a label
   * @param texture
   * @param callback
   */
  addLabel(texture: AdvancedDynamicTexture, callback: Function) {
    if (this._marker.getlabelImg() == "") {
      this._GUIbutton = Button.CreateImageOnlyButton(
        "GUIbutton",
        this._marker.getlabelImg()
      );
    } else {
      this._GUIbutton = Button.CreateSimpleButton(
        "GUIbutton",
        this._marker.getName()
      );
    }

    this._GUIbutton.linkOffsetY = 10;

    // this._GUIbutton.width = this._config.labelWidth;
    // this._GUIbutton.height = this._config.labelHeight;

    this._GUIbutton.thickness = this._config.label.thickness;
    this._GUIbutton.height = this._config.label.height + "px";
    this._GUIbutton.width = this._config.label.width + "px";
    this._GUIbutton.color = this._config.label.colour;
    this._GUIbutton.background = this._config.label.bgcolour;

    // add to the advanced Texture
    texture.addControl(this._GUIbutton);

    // link it to the marker
    this._GUIbutton.linkWithMesh(this._mesh);

    this._GUIbutton.onPointerDownObservable.add(() => {
      callback.call(callback, this._marker);
    });
  }
}
