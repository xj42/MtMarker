import { GPSPoint } from "../classes/GPSPoint";

export class Marker {
  private _location: GPSPoint = GPSPoint.Zero();
  private _name: string ="";
  private _description: string ="";
  private _labelImage: string ="";

  constructor(data) {
    this._location = new GPSPoint(
      data.location.lat,
      data.location.lng,
      data.location.alt
    );
    this._name = data.name;
    this._description = data.desc;
    this._labelImage = data.labelImage;
  }

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
  getlabelImg(){
	  return this._labelImage;
  }
}
