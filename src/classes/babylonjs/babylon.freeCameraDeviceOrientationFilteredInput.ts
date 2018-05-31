import { Quaternion, ICameraInput, CameraInputTypes, Tools, Nullable } from 'babylonjs';
import { UserDeviceOrientationCamera } from './babylon.userdeviceOrientationCamera';
/**
 * Takes information about the orientation of the device as reported by the deviceorientation event to orient the camera.
 * Screen rotation is taken into account.
 */
declare var navigator;
declare var device;

export class FreeCameraDeviceOrientationFilteredInput implements ICameraInput<UserDeviceOrientationCamera> {

	private _camera: UserDeviceOrientationCamera;
	private _screenOrientationAngle: number = 0;

	private _constantTranform: Quaternion;
	private _screenQuaternion: Quaternion = new Quaternion();

	private _alpha: number = 0;
	private _beta: number = 0;
	private _gamma: number = 0;
	private _drift: number = 0;
	private _lastDrift: number = 0;
	private _threshold:number = 3;
	private _rotationRate = 0;
	private _rotationMatrix = new Array(9);
	private _watchGyro = null;
	private _sensorOptions = { frequency: 100 };
	private _gyro: any;

	constructor(threshold?: number) {
		// text
		if (threshold !== undefined) { this._threshold = threshold; }
		if (device.platform && device.platform.toLowerCase() != 'browser') {
			this._gyro = navigator.gyroscope;
		}

		this._constantTranform = new Quaternion(- Math.sqrt(0.5), 0, 0, Math.sqrt(0.5));
		this._orientationChanged();
	}

	/**
	 *
	 */
	public get camera(): UserDeviceOrientationCamera {
		// text
		return this._camera;
	}

	/**
	 *
	 */
	public set camera(camera: UserDeviceOrientationCamera) {
		// text

		this._camera = camera;
		if (this._camera != null && !this._camera.rotationQuaternion) {
			this._camera.rotationQuaternion = new Quaternion();
		}
	}

	/**
	 *
	 * @param element
	 * @param noPreventDefault
	 */
	attachControl(element: HTMLElement, noPreventDefault?: boolean) {
		// text
		window.addEventListener("orientationchange", this._orientationChanged);
		window.addEventListener("deviceorientation", this._deviceOrientation);
		//In certain cases, the attach control is called AFTER orientation was changed,
		//So this is needed.
		if (device.platform && device.platform.toLowerCase() != 'browser') {

		var cam = this;
		this._watchGyro = this._gyro.watch(function (gyro: any) {
			cam._gyroSuccess(gyro);
		}, cam._gyroError, this._sensorOptions);
	}
		// this._gyro.watch().subscribe((orientation: any) => {
		// 		this._gyroSuccess(orientation);
		// 		console.log(orientation.x, orientation.y, orientation.z, orientation.timestamp);
		// 	});
		// if (this._platform.toLowerCase() == "android") {

		// 	// Orientation
		// 	this._sensors.enableSensor("ROTATION_VECTOR");
		// 	var _th = this;
		// 	this._timer = setInterval(function () {
		// 		_th._sensors.getState(_th._sensorsRaw)
		// 	}, 50);
		// }

		this._orientationChanged();
	}

	/**
	 *
	 * @param gyro
	 */
	_gyroSuccess(gyro: any) {
		// text
		this._rotationRate = gyro.x !== null ? BABYLON.Tools.ToDegrees(gyro.x) : 0;
	}

	/**
	 *
	 * @param gyro
	 */
	_gyroError(gyro: any) {
		// text
		console.log("GYRO ERROR:" + gyro);
	}

	/**
	 *
	 * @param evt
	 */
	_sensorsRaw(evt: any) {
		// text

		var q0;
		var q1 = evt[0];
		var q2 = evt[1];
		var q3 = evt[2];
		if (evt.length >= 4) {
			q0 = evt[3];
		} else {
			q0 = 1 - q1 * q1 - q2 * q2 - q3 * q3;
			q0 = (q0 > 0) ? Math.sqrt(q0) : 0;
		}

		var sq_q1 = 2 * q1 * q1;
		var sq_q2 = 2 * q2 * q2;
		var sq_q3 = 2 * q3 * q3;
		var q1_q2 = 2 * q1 * q2;
		var q3_q0 = 2 * q3 * q0;
		var q1_q3 = 2 * q1 * q3;
		var q2_q0 = 2 * q2 * q0;
		var q2_q3 = 2 * q2 * q3;
		var q1_q0 = 2 * q1 * q0;

		this._rotationMatrix[0] = 1 - sq_q2 - sq_q3;
		this._rotationMatrix[1] = q1_q2 - q3_q0;
		this._rotationMatrix[2] = q1_q3 + q2_q0;
		this._rotationMatrix[3] = q1_q2 + q3_q0;
		this._rotationMatrix[4] = 1 - sq_q1 - sq_q3;
		this._rotationMatrix[5] = q2_q3 - q1_q0;
		this._rotationMatrix[6] = q1_q3 - q2_q0;
		this._rotationMatrix[7] = q2_q3 + q1_q0;
		this._rotationMatrix[8] = 1 - sq_q1 - sq_q2;

		// Orientation (yaw, pitch, roll from matrix)
		/*
		 * 3x3 (length=9) :
		 *   /  R[ 0]   R[ 1]   R[ 2]  \
		 *   |  R[ 3]   R[ 4]   R[ 5]  |
		 *   \  R[ 6]   R[ 7]   R[ 8]  /
		 *
		 */

		var values = new Array(3);
		values[0] = Math.atan2(this._rotationMatrix[1], this._rotationMatrix[4]);
		values[1] = Math.asin(-this._rotationMatrix[7]);
		values[2] = Math.atan2(-this._rotationMatrix[6], this._rotationMatrix[8]);

		this._calculate(-BABYLON.Tools.ToDegrees(values[0]), -BABYLON.Tools.ToDegrees(values[1]), BABYLON.Tools.ToDegrees(values[2]));
	}

	/**
	 *
	 * @param Q
	 * @param rv
	 */
	getQuaternionFromVector(Q: any, rv: any) {
		// text

		if (rv.length >= 4) {
			Q[0] = rv[3];
		} else {
			Q[0] = 1 - rv[0] * rv[0] - rv[1] * rv[1] - rv[2] * rv[2];
			Q[0] = (Q[0] > 0) ? Math.sqrt(Q[0]) : 0;
		}
		Q[1] = rv[0];
		Q[2] = rv[1];
		Q[3] = rv[2];
	}

	private _calculate = (alpha: any, beta: any, gamma: any) => {
		// text
		this._beta = beta !== null ? beta : 0;
		this._gamma = gamma !== null ? gamma : 0;

		if (this._rotationRate && this._rotationRate !== 0) {
			if (Math.abs(this._rotationRate) < this._threshold) {
				// drift is the difference between the sensor input and the camera position
				this._drift = ((alpha !== null ? alpha : 0) - this._alpha);
			}
		}

		// // make sure the drift compensation is not convused by beta flip
		if (Math.abs(this._lastDrift - this._drift) > 160 &&
			Math.abs(this._lastDrift - this._drift) < 270) {
			this._drift += 180;
		}

		// normalise to compass
		this._alpha = (((alpha !== null ? alpha : 0) - this._drift) + 360) % 360;
		this._lastDrift = this._drift;
	}

	/**
	 *
	 */
	private _orientationChanged = () => {
		this._screenOrientationAngle = (window.orientation !== undefined ? +window.orientation : (window.screen.orientation && (<any>window.screen.orientation)['angle'] ? (<any>window.screen.orientation).angle : 0));
		// this._screenOrientationAngle = -Tools.ToRadians(this._screenOrientationAngle / 2);
		// this._screenQuaternion.copyFromFloats(0, Math.sin(this._screenOrientationAngle), 0, Math.cos(this._screenOrientationAngle));
		this._screenQuaternion.copyFromFloats(0, -0.707, 0, 0.707);

	}

	/**
	 *
	 */
	private _deviceOrientation = (evt: DeviceOrientationEvent) => {
		// this._alpha = evt.alpha !== null ? evt.alpha : 0;
		// this._beta = evt.beta !== null ? evt.beta : 0;
		// this._gamma = evt.gamma !== null ? evt.gamma : 0;
		this._calculate(evt.alpha, evt.beta, evt.gamma);
	}

	/**
	 *
	 * @param element
	 */
	detachControl(element: Nullable<HTMLElement>) {
		if (device.platform && device.platform.toLowerCase() != 'browser') {
			this._gyro.clearWatch(this._watchGyro);
		}
		// if (this._platform.toLowerCase() == "android") {

		// 	// clear timer
		// 	clearInterval(this._timer);

		// 	// stop sensor
		// 	this._sensors.disableSensor("GAME_ROTATION_VECTOR");
		// 	// stop fusion sensors
		// 	// navigator.fusion.clearWatch(this._watchFusion);
		// 	// 	this._watchFusion = null;
		// }
		window.removeEventListener("orientationchange", this._orientationChanged);
		window.removeEventListener("deviceorientation", this._deviceOrientation);
	}

	/**
	 *
	 */
	public checkInputs() {
		//if no device orientation provided, don't update the rotation.
		//Only testing against alpha under the assumption thatnorientation will never be so exact when set.
		if (!this._alpha) return;
		Quaternion.RotationYawPitchRollToRef(Tools.ToRadians(this._alpha), Tools.ToRadians(this._beta), -Tools.ToRadians(this._gamma), this.camera.rotationQuaternion)
		this._camera.rotationQuaternion.multiplyInPlace(this._screenQuaternion);
		this._camera.rotationQuaternion.multiplyInPlace(this._constantTranform);
		//Mirror on XY Plane
		this._camera.rotationQuaternion.z *= -1;
		this._camera.rotationQuaternion.w *= -1;
	}

	/**
	 *
	 */
	getClassName(): string {
		return "FreeCameraDeviceOrientationFilteredInput";
	}

	/**
	 *
	 */
	getSimpleName() {
		return "filteredDeviceOrientation";
	}
}

(<any>CameraInputTypes)["FreeCameraDeviceOrientationFilteredInput"] = FreeCameraDeviceOrientationFilteredInput;

