import { Tools, Vector3 } from "babylonjs";

export class GPSPoint {
  constructor(
    private _lat: number,
    private _lng: number,
    private _alt: number
  ) {}

  static Zero() {
    return new GPSPoint(0, 0, 0);
  }

  public getAlt() {
    return this._alt;
  }
  public getLat() {
    return this._lat;
  }
  public getLng() {
    return this._lng;
  }

  public distanceFrom(location: GPSPoint): number {
    return this.distance(location);
  }

  public distanceTo(location: GPSPoint): number {
    return this.distance(location);
  }

  public clone() {
    return new GPSPoint(this._lat, this._lng, this._alt);
  }

  private distance(location: GPSPoint, radius?: number): number {
    radius = radius === undefined ? 6371e3 : Number(radius);

    // a = sin²(deltalat/2) + cos(lat1)⋅cos(lat2)⋅sin²(deltalng/2)
    // tanδ = √(a) / √(1−a)
    // see mathforum.org/library/drmath/view/51879.html for derivation

    var R = radius;
    var lat1 = Tools.ToRadians(this._lat),
      lng1 = Tools.ToRadians(this._lng);
    var lat2 = Tools.ToRadians(location._lat),
      lng2 = Tools.ToRadians(location._lng);
    var deltalat = lat2 - lat1;
    var deltalng = lng2 - lng1;

    var a =
      Math.sin(deltalat / 2) * Math.sin(deltalat / 2) +
      Math.cos(lat1) *
        Math.cos(lat2) *
        Math.sin(deltalng / 2) *
        Math.sin(deltalng / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;

    return d; // Meters
  }

  public bearingFrom(location: GPSPoint): number {
    return this.bearing(location, this);
  }

  public bearingTo(location: GPSPoint): number {
    return this.bearing(this, location);
  }

  private bearing(from: GPSPoint, to: GPSPoint): number {
    var lat1 = Tools.ToRadians(from._lat),
      lat2 = Tools.ToRadians(to._lat);
    var deltalng = Tools.ToRadians(to._lng - from._lng);
    var y = Math.sin(deltalng) * Math.cos(lat2);
    var x =
      Math.cos(lat1) * Math.sin(lat2) -
      Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltalng);
    var angle = Math.atan2(y, x);

    return (Tools.ToDegrees(angle) + 360) % 360;
  }

  /**
   * Use distance, bearing and radius of the sphere to calculate lat/lng
   */
  public destinationPoint(
    distance: number,
    bearing: number,
    radius?: number
  ): GPSPoint {
    radius = radius === undefined ? 6371e3 : Number(radius);

    // sinlat2 = sinlat1⋅cosδ + coslat1⋅sinδ⋅cosθ
    // tanΔlng = sinθ⋅sinδ⋅coslat1 / cosδ−sinlat1⋅sinlat2
    // see mathforum.org/library/drmath/view/52049.html for derivation

    var AngularDistance = Number(distance) / radius; // angular distance in radians
    var Bearing = Tools.ToRadians(Number(bearing));
    var lat1 = Tools.ToRadians(this._lat);
    var lng1 = Tools.ToRadians(this._lng);

    var sinlat1 = Math.sin(lat1),
      coslat1 = Math.cos(lat1);
    var sinAngularDistance = Math.sin(AngularDistance),
      cosAngularDistance = Math.cos(AngularDistance);
    var sinBearing = Math.sin(Bearing),
      cosBearing = Math.cos(Bearing);

    var sinlat2 =
      sinlat1 * cosAngularDistance + coslat1 * sinAngularDistance * cosBearing;
    var lat2 = Math.asin(sinlat2);
    var y = sinBearing * sinAngularDistance * coslat1;
    var x = cosAngularDistance - sinlat1 * sinlat2;
    var lng2 = lng1 + Math.atan2(y, x);

    return new GPSPoint(
      Tools.ToDegrees(lat2),
      ((Tools.ToDegrees(lng2) + 540) % 360) - 180,
      0
    ); // normalise to −180..+180°
  }

  /**
   * Calculate new point
   * @param {meters} distance
   * @param {degrees} bearing
   */
  public destinationPoint2D(distance, bearing) {
    // bearing = Math.round(bearing)
    var x = (distance * Math.cos(Tools.ToRadians(bearing))) / 10;
    var z = (distance * Math.sin(Tools.ToRadians(bearing))) / 10;
    return new Vector3(z, 0, x);
  }
}
