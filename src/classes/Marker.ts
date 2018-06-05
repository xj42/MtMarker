import { GPSPoint } from "../classes/GPSPoint";

export class Marker {
  constructor(
    private _location: GPSPoint,
    private _name: string,
    private _description?: string
  ) {}

  distanceTo(location: GPSPoint) {
    return this._location.distanceTo(location);
  }
  getName(): string {
    return this._name;
  }
  getDesc(): string {
    return this._description;
  }
  getLocation(): GPSPoint {
    return this._location;
  }
  getAlt(): number {
    return this._location.getAlt();
  }
  getLat(): number {
    return this._location.getLat();
  }
  getLng(): number {
    return this._location.getLng();
  }
}
