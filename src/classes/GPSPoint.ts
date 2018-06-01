export class GPSPoint {
  public lat: number;
  public lng: number;
  public alt: number;

  constructor(lat: number, lng: number, alt: number) {
    this.lat = lat;
    this.lng = lng;
    this.alt = alt;
  }

  public distanceFrom(location: GPSPoint): number {
    let result = 0;
    return result;
  }

  public distanceTo(location: GPSPoint): number {
    let result = 0;
    return result;
  }

  private distance(location: GPSPoint): number {
    let result = 0;
    return result;
  }

  public bearingFrom(location: GPSPoint): number {
    let result = 0;
    return result;
  }

  public bearingTo(location: GPSPoint): number {
    let result = 0;
    return result;
  }

  private bearing(from: GPSPoint, to: GPSPoint): number {
    let result = 0;
    return result;
  }
}
