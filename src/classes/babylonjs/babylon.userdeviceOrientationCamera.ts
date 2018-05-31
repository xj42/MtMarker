import { Quaternion, FreeCamera, Vector3, Scene, Axis } from 'babylonjs';

// We're mainly based on the logic defined into the FreeCamera code
/**
 * This is a camera specifically designed to react to device orientation events such as a modern mobile device
 * being tilted forward or back and left or right.
 */
export class UserDeviceOrientationCamera extends FreeCamera {

	private _initialQuaternion: Quaternion;
	private _quaternionCache: Quaternion;

	/**
	 * Creates a new device orientation camera
	 * @param name The name of the camera
	 * @param position The start position camera
	 * @param scene The scene the camera belongs to
	 */
	constructor(name: string, position: Vector3, scene: Scene) {
		super(name, position, scene);
		this._quaternionCache = new Quaternion();
		// this.inputs.addFilteredDeviceOrientation();
	}

	/**
	 * Gets the current instance class name ("DeviceOrientationCamera").
	 * This helps avoiding instanceof at run time.
	 * @returns the class name
	 */
	public getClassName(): string {
		return "UserDeviceOrientationCamera";
	}

	/**
	 * Checks and applies the current values of the inputs to the camera. (Internal use only)
	 */
	public _checkInputs(): void {
		super._checkInputs();
		this._quaternionCache.copyFrom(this.rotationQuaternion);
		if (this._initialQuaternion) {
			this._initialQuaternion.multiplyToRef(this.rotationQuaternion, this.rotationQuaternion);
		}
	}

	/**
	 * Reset the camera to its default orientation on the specified axis only.
	 * @param axis The axis to reset
	 */
	public resetToCurrentRotation(axis: Axis = Axis.Y): void {

		//can only work if this camera has a rotation quaternion already.
		if (!this.rotationQuaternion) return;

		if (!this._initialQuaternion) {
			this._initialQuaternion = new Quaternion();
		}

		this._initialQuaternion.copyFrom(this._quaternionCache || this.rotationQuaternion);

		['x', 'y', 'z'].forEach((axisName) => {
			if (!(<any>axis)[axisName]) {
				(<any>this._initialQuaternion)[axisName] = 0;
			} else {
				(<any>this._initialQuaternion)[axisName] *= -1;
			}
		});
		this._initialQuaternion.normalize();
		//force rotation update
		this._initialQuaternion.multiplyToRef(this.rotationQuaternion, this.rotationQuaternion);
	}

	public resetToNewYRotation(dir: number) {

		if (dir === undefined) dir = 0;

		//can only work if this camera has a rotation quaternion already.
		if (!this.rotationQuaternion) return;

		if (!this._initialQuaternion) {
			this._initialQuaternion = new BABYLON.Quaternion();
		}

		this._initialQuaternion.copyFrom(this._quaternionCache || this.rotationQuaternion);

		// Find z+
		this._initialQuaternion.x = 0;
		this._initialQuaternion.z = 0;
		this._initialQuaternion.y *= -1;

		this._initialQuaternion.normalize();

		// rotation from z+
		var rot = this._initialQuaternion.toEulerAngles()
		rot.y += dir * Math.PI / 180;

		BABYLON.Quaternion.RotationYawPitchRollToRef(rot.y, rot.x, rot.z, this._initialQuaternion);

		this._initialQuaternion.normalize();

		//force rotation update
		this._initialQuaternion.multiplyToRef(this.rotationQuaternion, this.rotationQuaternion);
	}
}

