import { Mesh, Scene, Vector3, StandardMaterial, MeshBuilder } from "babylonjs";
import { Button, AdvancedDynamicTexture } from "babylonjs-gui";
import { Marker } from "../classes/Marker";
import { ConfigProvider } from "../providers/config/config";
import { AppModule } from "../app/app.module";

export class BabylonMarker {
  private _mesh: Mesh = null;
  private _material: StandardMaterial = null;
  private _GUIbutton: Button = null;
  private _config: ConfigProvider;
  private _buttonOffset: number =0;
  private _label: {
    height: number;
    width: number;
    colour: string;
    bgcolour: string;
    offset: number;
    thickness: number;
  }

  constructor(private _marker: Marker, private _scene: Scene) {
    this._config = AppModule.injector.get(ConfigProvider);
	this.updateMesh();
	this._label = this._config.label;
  }

  /**
   * Create / Update a mesh
   */
  updateMesh(){
	if (this._mesh != null) this._mesh.dispose();

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
	if (this._GUIbutton != null) this._GUIbutton.dispose();

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


    // this._GUIbutton.width = this._config.labelWidth;
    // this._GUIbutton.height = this._config.labelHeight;

    this._GUIbutton.thickness = this._label.thickness;
    this._GUIbutton.height = this._label.height + "px";
    this._GUIbutton.width = this._label.width + "px";
    this._GUIbutton.color = this._label.colour;
    this._GUIbutton.background = this._label.bgcolour;

    // add to the advanced Texture
    texture.addControl(this._GUIbutton);

    // link it to the marker
    this._GUIbutton.linkWithMesh(this._mesh);
    this._GUIbutton.linkOffsetY =     this._GUIbutton.height;

    this._GUIbutton.onPointerDownObservable.add(() => {
      callback.call(callback, this._marker);
    });
  }

}
