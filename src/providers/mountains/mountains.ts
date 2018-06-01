import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Mountain } from "../../classes/Mountain";
import { GPSPoint } from "../../classes/GPSPoint";
import { ConfigProvider } from '../config/config';

/*
  Generated class for the MountainsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MountainsProvider {

  public mountains: Mountain[] = [];

  constructor(public http: HttpClient, private conf:ConfigProvider) {}

  update() {}


}
