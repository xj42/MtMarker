import { Injectable } from '@angular/core';
import { GPSPoint } from '../../classes/GPSPoint';

/*
  Generated class for the ConfigProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ConfigProvider {

	public location:GPSPoint;

	constructor() {

	}

}
